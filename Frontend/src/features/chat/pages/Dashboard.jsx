import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'
import {
  setCurrentChatId,
  updateChatDocument
} from "../chat.slice";
import { uploadPdf } from "../service/upload.service.js";



const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const dispatch = useDispatch()
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
  }

  const handleFileUpload = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    if (!currentChatId) {
      alert("Please create a chat first");
      return;
    }


    const formData = new FormData();

    formData.append("pdf", file);
    formData.append("chatId", currentChatId);


    try {
      setUploading(true);

      const response = await uploadPdf(formData);

      console.log("Upload Success:", response);

      dispatch(
        updateChatDocument({
          chatId: currentChatId,
          document: {
            id: response.documentId,
            name: file.name,
            size: file.size,
          },
        })
      );

    } catch (error) {
      console.error("Upload Failed:", error);

    } finally {
      setUploading(false);
    }
  };

  // text-[rgb(56,165,195)]

  return (
    <main className='min-h-screen w-full bg-[#07090f] p-3 text-white md:p-5'>
      <section className='mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl border   p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1 border-none'>
        <aside className='hidden h-full w-72 shrink-0 rounded-3xl border border-[#191919]  bg-[#080b12] p-4 md:flex md:flex-col'>
          <h1 className='mb-5 text-3xl text-[rgb(151,219,242)]  font-semibold tracking-tight'>Phoenix</h1>

          <button
            type="button"
            onClick={() => {
              dispatch(setCurrentChatId(null))
              setChatInput("")
            }}
            className="mb-4 w-full cursor-pointer rounded-xl bg-[rgb(88,150,171)] px-4 py-3 font-semibold text-[#080b12] transition hover:opacity-90"
          >
            + New Chat
          </button>

          <div className='mt-2 flex-1 space-y-2 overflow-y-auto pr-1'>
            {Object.values(chats)
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((chatItem, index) => (
                <div key={chatItem.id} className="group flex items-center gap-2">
                  <button
                    onClick={() => openChat(chatItem.id)}
                    type="button"
                    className={`flex-1 cursor-pointer rounded-xl border px-3 py-2 text-left text-base font-medium transition
      ${currentChatId === chatItem.id
                        ? "border-[rgb(151,219,242)] bg-[rgb(151,219,242)]/10 text-[rgb(151,219,242)]"
                        : "border-[#191919] bg-transparent text-white/90 hover:border-white hover:text-white"
                      }`}
                  >
                    {chatItem.title}
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      console.log("Delete clicked", chatItem.id);
                      chat.handleDeleteChat(chatItem.id);
                    }}
                    className="cursor-pointer rounded-lg p-2 text-white/50 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 hover:text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              ))}
          </div>
        </aside>

        <section className='relative max-w-3/5 mx-auto flex h-full min-w-0 flex-1 flex-col gap-4'>

          <div className='messages text-amber-100 flex-1 space-y-3 overflow-y-auto pr-1 pb-30'>

            {chats[currentChatId]?.document && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3">

                <div className="text-2xl">
                  📄
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    {chats[currentChatId].document.name}
                  </p>

                  <p className="text-xs text-white/50">
                    PDF uploaded
                  </p>
                </div>

              </div>
            )}

            {chats[currentChatId]?.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${message.role === 'user'
                  ? 'ml-auto rounded-br-none bg-white/12 text-[#fafae8]'
                  : 'mr-auto border-none text-white/90'
                  }`}
              >
                {message.role === 'user' ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                      ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                      ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                      code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5'>{children}</code>,
                      pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3'>{children}</pre>
                    }}
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <footer className='rounded-3xl w-full absolute bottom-2 bg-[#080b12] p-4 md:p-5'>
            <form onSubmit={handleSubmitMessage} className='flex flex-col gap-3 md:flex-row'>
              <div className="flex flex-1 items-center gap-2">

                <label
                  className="cursor-pointer rounded-xl border border-white/30 p-3 pl-4 pr-4 text-white/70 hover:bg-white/10"
                >
                  +

                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFileUpload}
                  />

                </label>


                <input
                  type='text'
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder='Ask anything...'
                  className='w-full rounded-2xl border border-white/50 bg-transparent px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-white/90'
                />

              </div>
              <button
                type='submit'
                disabled={!chatInput.trim()}
                className='rounded-2xl border border-white/60 px-6 py-3 text-lg font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Dashboard