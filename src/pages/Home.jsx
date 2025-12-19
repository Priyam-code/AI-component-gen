import React, { useState } from 'react'
import Select from 'react-select'
import Navbar from "../components/Navbar";
import { BsStar, BsStars } from 'react-icons/bs';
import { LuCodeXml } from 'react-icons/lu';
import Editor from '@monaco-editor/react';
import { IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { BiRefresh } from 'react-icons/bi';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from "react-toastify";
import { MdClose } from 'react-icons/md';


function Home() {
    const options = [
        { value: 'html-css', label: 'HTML + CSS' },
        { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
        { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
        { value: 'html-css-js', label: 'HTML + CSS + JS' },
        { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
    ];
    const [outputScreen, setOutputScreen] = useState(false);
    const [tab, setTab] = useState(1);
    const [prompt, setPrompt] = useState("");
    const [Framework, setFramework] = useState(options[0]);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [isNewTabOpen, setisNewTabOpen] = useState(false);
    function extractCode(response) {
        const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
        return match ? match[1].trim() : response.trim();
    }





    const ai = new GoogleGenAI({ apiKey: "AIzaSyCPglYmPUiV6iRx2Jganf-Pb-rm29rlUTA" });
    async function getresponse() {
        setLoading(true);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${Framework.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
        });

        console.log(response.text);
        setCode(extractCode(response.text));
        setOutputScreen(true);
        setLoading(false);
    }

    const copycode = async () => {

        try {
            await navigator.clipboard.writeText(code);
            toast.success("copied");
        } catch (err) {

            toast.error("failed to copy");
        }
    }

    const downloadfile = () => {

        const filename = "GenUI-code.html";
        const blob = new Blob([code], { type: "text/plain" });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("downloaded");
    }

    return (
        <>
            <Navbar />
            <div className="flex items-center px-[100px]  justify-between gap-[30px]">

                <div className="left w-[50%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px] ">
                    <h3 className='text-[25px] font-semibold sp-text'>AI component generator</h3>
                    <p className='text-[gray]  text-[16px]'>Describe your component and let the magic begin </p>
                    <p className='text-[15px] font-[700] mt-4'>Framework</p>
                    <Select
                        className='mt-2'
                        options={options}

                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: "#111",
                                borderColor: "#333",
                                color: "#fff",
                                boxShadow: "none",
                                "&:hover": { borderColor: "#555" }
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: "#111",
                                color: "#fff"
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? "#333"
                                    : state.isFocused
                                        ? "#222"
                                        : "#111",
                                color: "#fff",
                                "&:active": { backgroundColor: "#444" }
                            }),
                            singleValue: (base) => ({ ...base, color: "#fff" }),
                            placeholder: (base) => ({ ...base, color: "#aaa" }),
                            input: (base) => ({ ...base, color: "#fff" })
                        }}
                        onChange={(e) => setFramework(e.value)}
                    />
                    <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
                    <textarea
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none'
                        placeholder="Describe your component in detail and AI will generate it..."
                    ></textarea>
                    <div className="flex items-center justify-between">

                        <p className='text-[gray] ml-3 mt-1'> Click on generate to get your output</p>
                        <button onClick={getresponse}

                            className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-[20px] gap-[10px] mt-3   transition-all hover:opacity-[.8]"
                        >

                            {
                                loading === true ?
                                    <>
                                        <ClipLoader className='text-[30px]' />
                                    </> : <>
                                        <i><BsStars /></i>
                                    </>



                            }
                            Generate
                        </button>

                    </div>

                </div>

                <div className="right relative mt-2 left w-[50%] h-[80vh] bg-[#141319] mt-5 rounded-xl ">
                    {
                        outputScreen === false ?
                            <>


                                <div className="skeleton w-full h-full flex flex-col items-center justify-center">
                                    <div className="circle p-[20px] w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-[50%] bg-gradient-to-r from-purple-400 to-purple-600"><LuCodeXml /></div>
                                    <p className='text-[16px] text-[gray] mt-3'> Your component & code here</p>
                                </div>
                            </> : <>
                                <div className="top bg-[#17171C] w-full h-[60px] flex items-center gap-[15px] px-[20px]">


                                    <button
                                        onClick={() => setTab(1)}
                                        className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                                    >
                                        Code</button>
                                    <button
                                        onClick={() => setTab(2)}
                                        className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                                    >Preview</button>


                                </div>
                                <div className="top-2 bg-[#17171C] w-full h-[50px] flex items-center justify-between px-[20px] gap-[15px]">
                                    <div className="left">
                                        <p className='font-bold'>Code Editor</p>
                                    </div>
                                    <div className="right flex items-center gap-[10px]">

                                        {
                                            tab === 1 ?
                                                <>
                                                    <button onClick={copycode} className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333] "><IoCopy /></button>
                                                    <button onClick={downloadfile} className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"><PiExportBold /></button>
                                                </> :
                                                <>
                                                    <button className="newtab w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => { setisNewTabOpen(true) }}><ImNewTab /></button>
                                                    <button className="refresh w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"><FiRefreshCcw /></button>

                                                </>
                                        }


                                    </div>






                                </div>

                                <div className="editor  h-full">

                                    {

                                        tab === 1 ?
                                            <>

                                                <Editor value={code} height="100%" theme='vs-dark' defaultLanguage="html" />

                                            </> :
                                            <>
                                                <iframe ref={code} className="preview w-full h-full  bg-white text-black flex items-center justify-center "></iframe>
                                            </>

                                    }

                                </div>
                            </>

                    }



                </div>
            </div>
            {
                isNewTabOpen === true ?
                    <>
                        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
                            <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
                                <p className='font-bold'>Preview</p>
                                <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
                                    <IoCloseSharp />
                                </button>
                            </div>
                            <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
                        </div>

                    </> : ""
            }
        </>
    );
}

export default Home