import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articleLength = [
    {length: 800, text: 'Short (500-800 words)'},
    {length: 1200, text: 'Medium (800-1200 words)'},
    {length: 1600, text: 'Long (1200+ words)'}
    
  ]

  const [selectedLength, setSelecetedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()

  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Write an article about ${input} in ${selectedLength.text}`

      const {data} = await axios.post('/api/ai/generate-article', {prompt, length:selectedLength.length}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Aricle Topic</p>

        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='The future of artificial inelligence is...' required/>

        <p className='mt-4 text-sm font-medium'>Article Length</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {articleLength.map((item, index)=>(
            <span onClick={()=> setSelecetedLength(item)} 
            className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`} key={index}>{item.text}</span>
          ))}
        </div>
        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Edit className='w-5' />
          }
          
          Generate Article
        </button>


      </form>
      {/* right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>Generated Article</h1>

        </div>

        {content ? (
          <div className='mt-3 h-full overflow-y-scroll text-base leading-7 text-slate-700 pr-1'>
            <ReactMarkdown
              components={{
                h1: (props) => <h1 className='text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight mt-1 mb-4' {...props} />,
                h2: (props) => <h2 className='text-xl sm:text-2xl font-semibold text-slate-800 mt-6 mb-3' {...props} />,
                h3: (props) => <h3 className='text-lg sm:text-xl font-semibold text-slate-800 mt-5 mb-2' {...props} />,
                p: (props) => <p className='text-slate-600 my-4' {...props} />,
                ul: (props) => <ul className='list-disc pl-6 space-y-3 my-4' {...props} />,
                ol: (props) => <ol className='list-decimal pl-6 space-y-3 my-4' {...props} />,
                li: (props) => <li className='text-slate-600' {...props} />,
                blockquote: (props) => <blockquote className='border-l-4 pl-4 italic text-slate-600 my-4' {...props} />,
                hr: (props) => <hr className='my-6 border-gray-200' {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Edit className='w-9 h-9'/>
              <p>Enter a topic and click "Generate Article" to get started</p>
            </div>
          </div>
        )}
        

      </div>
    </div>
  )
}

export default WriteArticle
