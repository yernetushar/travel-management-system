import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ManagerLayout from '../../components/layout/ManagerLayout'
import { getLocationMessages, sendMessage } from '../../api/chatApi'
import useAuthStore from '../../store/authStore'

export default function ManagerChat() {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState({})
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    loadMessages()
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    if (!user?.locationId) return
    try {
      const res = await getLocationMessages(user.locationId)
      // Group by conversationId
      const grouped = {}
      res.data.forEach(msg => {
        if (!grouped[msg.conversationId]) {
          grouped[msg.conversationId] = {
            conversationId: msg.conversationId,
            otherName: msg.senderRole === 'TOURIST' ? msg.senderName : msg.receiverName,
            otherId: msg.senderRole === 'TOURIST' ? msg.senderId : msg.receiverId,
            messages: []
          }
        }
        grouped[msg.conversationId].messages.push(msg)
      })
      setConversations(grouped)
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = (conv) => {
    setActiveConv(conv)
    setMessages(conv.messages)
  }

  const handleSend = async () => {
    if (!text.trim() || !activeConv) return
    setSending(true)
    try {
      const res = await sendMessage({
        receiverId: activeConv.otherId,
        receiverName: activeConv.otherName,
        locationId: user?.locationId,
        message: text.trim()
      })
      setMessages(prev => [...prev, res.data])
      setText('')
      // Update conversations
      setConversations(prev => ({
        ...prev,
        [activeConv.conversationId]: {
          ...prev[activeConv.conversationId],
          messages: [...prev[activeConv.conversationId].messages, res.data]
        }
      }))
    } catch {
      toast.error('Send failed')
    } finally {
      setSending(false)
    }
  }

  const convList = Object.values(conversations)

  return (
    <ManagerLayout>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 28, color: 'var(--ink)', marginBottom: 24
      }}>
        Messages
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, height: 'calc(100vh - 180px)' }}>
        {/* Conversation list */}
        <div style={{
          background: 'var(--card-bg)', borderRadius: 16,
          boxShadow: 'var(--shadow)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            fontWeight: 600, fontSize: 14, color: 'var(--ink)'
          }}>
            Conversations ({convList.length})
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--mist)' }}>Loading...</div>
            ) : convList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <MessageCircle size={32} color="var(--mist)" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: 'var(--mist)' }}>No messages yet</p>
              </div>
            ) : (
              convList.map(conv => {
                const last = conv.messages[conv.messages.length - 1]
                const isActive = activeConv?.conversationId === conv.conversationId
                return (
                  <div
                    key={conv.conversationId}
                    onClick={() => selectConversation(conv)}
                    style={{
                      padding: '14px 20px',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(196,98,45,0.08)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--terra)' : '3px solid transparent',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--terra)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0
                      }}>
                        {conv.otherName?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--ink)' }}>
                          {conv.otherName}
                        </div>
                        <div style={{
                          fontSize: 12, color: 'var(--mist)',
                          whiteSpace: 'nowrap', overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {last?.message}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Chat window */}
        {activeConv ? (
          <div style={{
            background: 'var(--card-bg)', borderRadius: 16,
            boxShadow: 'var(--shadow)',
            display: 'flex', flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'var(--terra)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700
              }}>
                {activeConv.otherName?.[0]?.toUpperCase()}
              </div>
              <div style={{ fontWeight: 500, color: 'var(--ink)' }}>
                {activeConv.otherName}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {messages.map(msg => {
                const isMine = msg.senderId === user?.id
                return (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                    marginBottom: 12
                  }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px',
                      borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isMine ? 'var(--terra)' : 'var(--sand)',
                      color: isMine ? 'white' : 'var(--ink)',
                      fontSize: 14, lineHeight: 1.5
                    }}>
                      {msg.message}
                      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: 8
            }}>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Reply to tourist..."
                style={{
                  flex: 1, padding: '10px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: 14, outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                disabled={sending || !text.trim()}
                style={{
                  padding: '10px 16px', background: 'var(--terra)',
                  border: 'none', borderRadius: 10,
                  color: 'white', cursor: 'pointer',
                  opacity: sending || !text.trim() ? 0.6 : 1
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--card-bg)', borderRadius: 16,
            boxShadow: 'var(--shadow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', color: 'var(--mist)' }}>
              <MessageCircle size={40} style={{ marginBottom: 12 }} />
              <p>Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  )
}