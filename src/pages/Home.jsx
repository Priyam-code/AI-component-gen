import React, { useState } from "react";
import Select from "react-select";
import Editor from "@monaco-editor/react";

import Navbar from "../components/Navbar";

import { BsStars } from "react-icons/bs";
import { LuCodeXml } from "react-icons/lu";
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { MdClose } from "react-icons/md";

import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";


const options = [
  {
    value: "html-css",
    label: "HTML + CSS",
  },
  {
    value: "html-tailwind",
    label: "HTML + Tailwind CSS",
  },
  {
    value: "html-bootstrap",
    label: "HTML + Bootstrap",
  },
  {
    value: "html-css-js",
    label: "HTML + CSS + JavaScript",
  },
  {
    value: "html-tailwind-bootstrap",
    label: "HTML + Tailwind + Bootstrap",
  },
];


const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;



function extractCode(response) {
  if (!response) {
    return "";
  }

  const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);

  return match ? match[1].trim() : response.trim();
}


function Home() {

  // Controls whether placeholder or generated output is displayed
  const [outputScreen, setOutputScreen] = useState(false);

  // 1 = Code tab, 2 = Preview tab
  const [tab, setTab] = useState(1);

  // User's component description
  const [prompt, setPrompt] = useState("");

  // Complete selected react-select object
  const [framework, setFramework] = useState(options[0]);

  // Generated HTML code
  const [code, setCode] = useState("");

  // Controls Generate button loader
  const [loading, setLoading] = useState(false);

  // Controls full-screen preview
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  // Changing this reloads the preview iframe
  const [previewKey, setPreviewKey] = useState(0);


 
  async function getResponse() {
    if (!prompt.trim()) {
      toast.error("Please describe the component first");
      return;
    }

    if (!framework) {
      toast.error("Please select a framework");
      return;
    }

    if (!ai) {
      toast.error("Gemini API key is missing");
      return;
    }

    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
You are an experienced web developer and UI/UX designer.

Generate a modern, animated and fully responsive UI component.

Component description:
${prompt}

Framework to use:
${framework.value}

Requirements:
- Create clean and properly structured code.
- Use modern typography, colors, shadows and spacing.
- Add responsive design.
- Add useful hover effects and animations.
- Return the complete code in one HTML file.
- Return only one Markdown fenced code block.
- Do not include explanations outside the code.
        `,
      });

      const generatedCode = extractCode(response.text);

      if (!generatedCode) {
        throw new Error("Gemini returned empty code");
      }

      setCode(generatedCode);

      // Replace placeholder with output section
      setOutputScreen(true);

      // Open Code tab after generation
      setTab(1);

      toast.success("Component generated successfully");
    } catch (error) {
      console.error("Gemini error:", error);

      toast.error(
        error?.message || "Failed to generate component"
      );
    } finally {
      setLoading(false);
    }
  }


 
  async function copyCode() {
    if (!code.trim()) {
      toast.error("There is no code to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy code");
    }
  }



  function downloadFile() {
    if (!code.trim()) {
      toast.error("There is no code to download");
      return;
    }

    const blob = new Blob([code], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "GenUI-code.html";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);

    toast.success("File downloaded");
  }


 
  function refreshPreview() {
    setPreviewKey((previousKey) => previousKey + 1);
  }


  return (
    <>
      <Navbar />

     
      <main className="flex flex-col lg:flex-row items-stretch px-4 lg:px-[100px] justify-between gap-[30px]">


        <section className="w-full lg:w-1/2 py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className="text-[25px] font-semibold sp-text">
            AI Component Generator
          </h3>

          <p className="text-gray-500 text-[16px]">
            Describe your component and let the magic begin
          </p>


          {/* Framework dropdown */}
          <p className="text-[15px] font-bold mt-4">
            Framework
          </p>

          <Select
            className="mt-2"
            options={options}
            value={framework}
            onChange={(selectedOption) => {
              setFramework(selectedOption);
            }}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                color: "#fff",
                boxShadow: "none",

                "&:hover": {
                  borderColor: "#555",
                },
              }),

              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                color: "#fff",
                zIndex: 20,
              }),

              option: (base, state) => ({
                ...base,

                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                    ? "#222"
                    : "#111",

                color: "#fff",

                "&:active": {
                  backgroundColor: "#444",
                },
              }),

              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),

              placeholder: (base) => ({
                ...base,
                color: "#aaa",
              }),

              input: (base) => ({
                ...base,
                color: "#fff",
              }),
            }}
          />


          {/* Component description */}
          <p className="text-[15px] font-bold mt-5">
            Describe your component
          </p>

          <textarea
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
            }}
            className="w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Describe your component in detail and AI will generate it..."
          />


          {/* Generate section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-gray-500 ml-3 mt-1">
              Click Generate to get your output
            </p>

            <button
              type="button"
              onClick={getResponse}
              disabled={loading}
              className={`flex items-center justify-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-[20px] gap-[10px] mt-3 transition-all ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-80"
              }`}
            >
              {loading ? (
                <ClipLoader size={20} />
              ) : (
                <BsStars />
              )}

              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </section>


        {/*
        
        | Right side: code and preview
       
        */}
        <section className="relative w-full lg:w-1/2 h-[80vh] bg-[#141319] mt-5 rounded-xl overflow-hidden flex flex-col">
          {!outputScreen ? (
           
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="p-[20px] w-[70px] h-[70px] flex items-center justify-center text-[30px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                <LuCodeXml />
              </div>

              <p className="text-[16px] text-gray-500 mt-3">
                Your component and code will appear here
              </p>
            </div>
          ) : (
            <>
              {/*
              | Code and Preview tabs
              */}
              <div className="bg-[#17171C] w-full h-[60px] flex items-center gap-[15px] px-[20px] shrink-0">
                <button
                  type="button"
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-2 rounded-lg transition-all ${
                    tab === 1
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-800 text-gray-300"
                  }`}
                >
                  Code
                </button>

                <button
                  type="button"
                  onClick={() => setTab(2)}
                  className={`w-1/2 py-2 rounded-lg transition-all ${
                    tab === 2
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-800 text-gray-300"
                  }`}
                >
                  Preview
                </button>
              </div>


              {/*
             
              | Action buttons
              */}
              <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-[20px] gap-[15px] shrink-0">
                <p className="font-bold">
                  {tab === 1
                    ? "Code Editor"
                    : "Component Preview"}
                </p>

                <div className="flex items-center gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={copyCode}
                        title="Copy code"
                        className="w-[40px] h-[40px] rounded-xl border border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"
                      >
                        <IoCopy />
                      </button>

                      <button
                        type="button"
                        onClick={downloadFile}
                        title="Download HTML file"
                        className="w-[40px] h-[40px] rounded-xl border border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"
                      >
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewTabOpen(true);
                        }}
                        title="Open full-screen preview"
                        className="w-[40px] h-[40px] rounded-xl border border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"
                      >
                        <ImNewTab />
                      </button>

                      <button
                        type="button"
                        onClick={refreshPreview}
                        title="Refresh preview"
                        className="w-[40px] h-[40px] rounded-xl border border-zinc-900 flex items-center justify-center transition-all hover:bg-[#333]"
                      >
                        <FiRefreshCcw />
                      </button>
                    </>
                  )}
                </div>
              </div>


              {/*
              |--------------------------------------------------------------------------
              | Monaco editor or iframe preview
              |--------------------------------------------------------------------------
              */}
              <div className="flex-1 min-h-0">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    onChange={(newValue) => {
                      setCode(newValue || "");
                    }}
                    height="100%"
                    theme="vs-dark"
                    defaultLanguage="html"
                    options={{
                      minimap: {
                        enabled: false,
                      },
                      fontSize: 14,
                      wordWrap: "on",
                      automaticLayout: true,
                    }}
                  />
                ) : (
                  <iframe
                    key={previewKey}
                    srcDoc={code}
                    title="Generated component preview"
                    sandbox="allow-scripts allow-forms allow-modals"
                    className="w-full h-full bg-white"
                  />
                )}
              </div>
            </>
          )}
        </section>
      </main>


      {/*
      |--------------------------------------------------------------------------
      | Full-screen preview
      |--------------------------------------------------------------------------
      */}
      {isNewTabOpen && (
        <div className="fixed inset-0 z-50 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className="font-bold">
              Preview
            </p>

            <button
              type="button"
              onClick={() => {
                setIsNewTabOpen(false);
              }}
              className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200"
            >
              <MdClose />
            </button>
          </div>

          <iframe
            key={`fullscreen-${previewKey}`}
            srcDoc={code}
            title="Full-screen generated component preview"
            sandbox="allow-scripts allow-forms allow-modals"
            className="w-full h-[calc(100vh-60px)]"
          />
        </div>
      )}
    </>
  );
}

export default Home;