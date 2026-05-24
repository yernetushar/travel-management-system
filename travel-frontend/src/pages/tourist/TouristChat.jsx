import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Send, MessageCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import TouristLayout from '../../components/layout/TouristLayout'
import { sendMessage, getConversation } from '../../api/chatApi'
import useAuthStore from '../../store/authStore'

export default function TouristChat() {
  const location = useLocation()
  const { user } = useAuthStore()
  const state = location.state || {}

  const [managerId, setManagerId] = useState(state.managerId || '')
  const [managerName, setManagerName] = useState(state.managerName || '')
  const [locationId, setLocationId] = useState(state.locationId || 'goa')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (managerId) loadConversation()
  }, [managerId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversation = async () => {
    setLoading(true)
    try {
      const res = await getConversation(managerId, locationId)
      setMessages(res.data)
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!text.trim() || !managerId) return
    setSending(true)
    try {
      const res = await sendMessage({
        receiverId: managerId,
        receiverName: managerName,
        locationId,
        message: text.trim()
      })
      setMessages(prev => [...prev, res.data])
      setText('')
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <TouristLayout>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 28, color: 'var(--ink)', marginBottom: 20
      }}>
        Chat
      </h1>

      {!managerId ? (
        <div style={{
          background: 'var(--card-bg)', borderRadius: 20,
          padding: 32, textAlign: 'center', boxShadow: 'var(--shadow)'
        }}>
          <MessageCircle size={40} color="var(--mist)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--mist)', marginBottom: 20 }}>
            Visit a site and click "Chat with Manager" to start a conversation
          </p>
          <div style={{ maxWidth: 360, margin: '0 auto' }}>
            <label style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
              Or enter Manager ID manually:
            </label>
            <input
              value={managerId}
              onChange={e => setManagerId(e.target.value)}
              placeholder="Manager ID from Atlas"
              style={{
                width: '100%', padding: '10px 14px',
                border: '1.5px solid var(--border)',
                borderRadius: 10, fontSize: 14, outline: 'none',
                marginBottom: 12
              }}
            />
            <input
              value={managerName}
              onChange={e => setManagerName(e.target.value)}
              placeholder="Manager Name"
              style={{
                width: '100%', padding: '10px 14px',
                border: '1.5px solid var(--border)',
                borderRadius: 10, fontSize: 14, outline: 'none'
              }}
            />
          </div>
        </div>
      ) : (
        <div style={{
          background: 'var(--card-bg)', borderRadius: 20,
          boxShadow: 'var(--shadow)',
          display: 'flex', flexDirection: 'column',
          height: 'calc(100vh - 220px)',
          minHeight: 400
        }}>
          {/* Chat header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--terra)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 16
            }}>
              {managerName?.[0]?.toUpperCase() || 'M'}
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>
                {managerName || 'Tourism Manager'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--mist)', textTransform: 'capitalize' }}>
                {locationId} Tourism Manager
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--mist)', padding: 40 }}>
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--mist)', padding: 40 }}>
                Start the conversation!
              </div>
            ) : (
              messages.map(msg => {
                const isMine = msg.senderId === user?.id
                return (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: isMine ? 'flex-end' : 'flex-start',
                    marginBottom: 12
                  }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '10px 14px',
                      borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isMine ? 'var(--terra)' : 'var(--sand)',
                      color: isMine ? 'white' : 'var(--ink)',
                      fontSize: 14,
                      lineHeight: 1.5,
                      boxShadow: 'var(--shadow)'
                    }}>
                      {msg.message}
                      <div style={{
                        fontSize: 10,
                        opacity: 0.7,
                        marginTop: 4,
                        textAlign: 'right'
                      }}>
                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
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
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1, padding: '10px 14px',
                border: '1.5px solid var(--border)',
                borderRadius: 10, fontSize: 14,
                outline: 'none', color: 'var(--ink)'
              }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !text.trim()}
              style={{
                padding: '10px 16px',
                background: 'var(--terra)',
                border: 'none', borderRadius: 10,
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                opacity: sending || !text.trim() ? 0.6 : 1
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </TouristLayout>
  )
}