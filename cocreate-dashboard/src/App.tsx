import { useEffect, useState } from 'react'
import './App.css'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { Annotation } from './types/global'
import { generateCoCreateData } from './utils/data-generator'
import { cn } from './lib/utils'
import Ping from './components/ping/Ping'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import Canvas from './components/canvas/Canvas'
// import { PieChartComponent } from './components/pie-chart/Test'
import Header from './components/layout/Header'
import { Checkbox, CheckboxWithText } from './components/ui/checkbox'
import { MultiSelect } from './components/ui/multi-select'

interface MultiSelectType {
  value: string;
  label: string;
}

function App() {
  // const generateNumber = () => Math.floor(Math.random() * 1000)

  const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [aggregatedAnnotations, setAggregatedAnnotations] = useState<Annotation[][]>([])
  const [activeAnnotation, setActiveAnnotation] = useState<number>(-1)
  const [annotationViewMode, setAnnotationViewMode] = useState<'single' | 'grid'>('grid')

  const [rolesList, setRolesList] = useState<MultiSelectType[]>([
    { value: "architect", label: "Architect" },
    { value: "designer", label: "Designer" },
    { value: "developer", label: "Developer" },
  ])
  const [tenureList, setTenureList] = useState<MultiSelectType[]>([
    { value: "junior", label: "Junior" },
    { value: "mid-level", label: "Mid-Level" },
    { value: "senior", label: "Senior" },
  ])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedTenures, setSelectedTenures] = useState<string[]>([])

  // function formatBase64Image(image: string) {
  //   return image.startsWith("data:image") ? image : `data:image/png;base64,${image}`;
  // }

  function importAnnotations() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) { console.log(file) }
    };
    input.click();
}

  const currentAnnotationComments = aggregatedAnnotations[activeAnnotation] || []
  const generateRandomData = () => {
    const numQuestions = 14
    const maxAnnotation = 14
    const minSelectionPerAnnotation = 4
    const maxSelectionPerAnnotation = 6
    const imageSize: [number, number] = [400, 270]
    const pictureRange = 4
    
    const generatedData = generateCoCreateData(
      numQuestions, 
      maxAnnotation, 
      minSelectionPerAnnotation, 
      maxSelectionPerAnnotation, 
      imageSize,
      pictureRange
    );
    setAnnotations(generatedData)

    // Create 10 buckets, and assign each annotation to a bucket based on questionId
    const buckets: Annotation[][] = Array.from({ length: numQuestions }, () => [])
    generatedData.forEach(annotation => {
      buckets[annotation.questionId].push(annotation)
    })
    console.log(buckets)
    setAggregatedAnnotations(buckets)
  }

  useEffect(() => generateRandomData(), [])

  const handleSelection = (index: number) => () => {
    const selectionIndex = activeAnnotation === index ? -1 : index
    setActiveAnnotation(selectionIndex)
  }

  const handleAnnotationViewModeChange = () => {
    setAnnotationViewMode(annotationViewMode === 'single' ? 'grid' : 'single')
  }

  return (
    <>
      {/* Header */}
      <Header />
      
      {/* Body */}
      <ResizablePanelGroup 
        direction='horizontal' 
        className="h-[100vh] rounded-lg"
      >
        {
          showSidebar &&
          <ResizablePanel minSize={30} className="bg-[#202020] border-2 border-[#333]">
            <div className="h-[92.5vh] w-[100%] border-2 border-[#333] p-5 gap-y-2 flex flex-col">
              
              <div className='flex justify-between items-center'>
                <h1 className="text-2xl font-bold pb-3">Annotations</h1>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white p-2"
                    onClick={importAnnotations}
                  >
                  Import
                  </Button>
              </div>

              {/* Search Bar */}
              <div className="flex justify-between items-center flex-wrap-reverse gap-2 ">
                <div className="flex">
                  <input 
                    type="text" placeholder="Search annotations" 
                    className="border border-[#333] dark:border-[#333] bg-[#111] p-1 max-w-[80%] w-[80%]" 
                  />
                  <button className="bg-blue-500 border-blue-500 border-2 text-white p-1">
                    Search
                  </button>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    className={cn(
                      "p-2 cursor-pointer",
                      { "bg-blue-500 text-white": annotationViewMode === "single" }, // Always active for now
                      { "bg-gray-700 text-gray-400": annotationViewMode !== "single" } // Always inactive for now
                    )}
                    onClick={handleAnnotationViewModeChange}
                  >
                    Single View
                  </Button>
                  <Button 
                    className={cn(
                      "p-2 cursor-pointer",
                      { "bg-blue-500 text-white": annotationViewMode === "grid" }, // Always inactive for now
                      { "bg-gray-700 text-gray-400": annotationViewMode !== "grid" } // Always active for now
                    )}
                    onClick={handleAnnotationViewModeChange}
                  >
                    Grid View
                  </Button>
                </div>

              </div>

              {
                annotationViewMode === "grid" &&
                <div className='mx-auto h-[90vh] overflow-scroll'>
                  <div 
                    className={cn(
                      "p-3 flex flex-wrap justify-center gap-5 h-[90vh] border-2 border-[#444] overflow-scroll",
                      // "p-3 flex flex-wrap gap-5 h-[90vh] border-2 border-[#444] overflow-scroll",
                      "bg-[#111]" // Dark Mode
                    )}
                    >
                      
                    {aggregatedAnnotations.map((annotation, index) =>  {
                    
                      let aestheticValues = annotation
                        .flatMap(annotation => annotation.selections)
                        .map(selection => selection.aestheticValue)
                        .reduce((acc, curr) => {
                          switch (curr) {
                            case 'good': acc.likes++; break;
                            case 'bad': acc.dislikes++; break;
                            default: acc.blank++; break;
                          }
                          return acc;
                        }, { likes: 0, dislikes: 0, blank: 0 })


                      let functionValues = annotation
                        .flatMap(annotation => annotation.selections)
                        .map(selection => selection.functionValue)
                        .reduce((acc, curr) => {
                          switch (curr) {
                            case 'good': acc.likes++; break;
                            case 'bad': acc.dislikes++; break;
                            default: acc.blank++; break;
                          }
                          return acc;
                        }, { likes: 0, dislikes: 0, blank: 0 })

                        let functionDislikePercentage = functionValues.dislikes / (functionValues.likes + functionValues.dislikes) * 100
                        let functionLikePercetange = functionValues.likes / (functionValues.likes + functionValues.dislikes) * 100
                        let functionDislikePercentageWidth = functionValues.dislikes === functionValues.likes  ? `50%` : `${functionDislikePercentage}%`
                        let functionLikePercentageWidth = functionValues.likes === functionValues.dislikes  ? `50%` : `${functionLikePercetange}%`

                      return (
                      <div
                        key={index} 
                        className={cn(
                          "flex jusify-content-center items-center relative cursor-pointer",
                          "hover:scale-105 transform transition duration-300 ease-in-out",
                          "border-3 border-transparent",
                          { "border-blue-500": activeAnnotation === index }
                        )}
                      >
                        <div className="relative w-full max-w-80 mx-auto border border-[#333] aspect-[3/2]">
                          <img 
                            src={annotation[index]?.imagePath ?? "-"}
                            alt="rendering" 
                            className="w-full h-full object-contain"
                            onClick={handleSelection(index)}
                          />
                          {/* Overlay to show the number of annotations */}
                          <div className="absolute bottom-0 left-0 w-full bg-[#111111cc] text-white z-30 flex flex-wrap-reverse">
                            <div className="w-full bg-[#111111cc] text-white p-1 z-30 text-ellipsis overflow-hidden whitespace-nowrap">
                              View {index + 1} - {annotation.length} comments
                            </div>
                            <div className='w-full flex'>
                                <div 
                                  className="text-xs bg-green-800 text-white p-0.5 z-30 text-ellipsis overflow-hidden whitespace-nowrap"
                                  style={{ width: functionLikePercentageWidth }}
                                >
                                  {functionValues.likes} [{isNaN(functionDislikePercentage) ? 'N/A' : Math.round(100 - functionDislikePercentage)}%]
                                </div>
                                <div className="text-xs bg-red-800 text-white p-0.5 z-30 text-ellipsis overflow-hidden whitespace-nowrap"
                                  style={{ width: functionDislikePercentageWidth }}
                                >
                                      {functionValues.dislikes} [{isNaN(functionDislikePercentage) ? 'N/A' : Math.round(functionDislikePercentage)}%]
                                </div>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    )}
                  )}
                  </div>
                </div>
              }
              {
                annotationViewMode === "single" &&
                <div className="flex flex-col gap-3 h-[90vh] overflow-scroll">
                  {aggregatedAnnotations.map((annotation, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex justify-between items-center p-2 cursor-pointer",
                        "hover:bg-[#333] border-2 border-[#444]",
                        { "bg-[#333]": activeAnnotation === index }
                      )}
                      onClick={handleSelection(index)}
                    >
                      <img 
                        src={annotation[index].imagePath}
                        alt="rendering" 
                        className="w-20 h-20"
                      />
                      <div className="flex flex-col gap-2">
                        <div>View {index + 1}</div>
                        {/* <div>{annotation.length} comments</div> */}
                      </div>
                    </div>
                  ))}
                </div>
              }

            </div>
          </ResizablePanel>
        }
        <ResizableHandle withHandle={activeAnnotation !== -1} />
        {
          activeAnnotation !== -1 && 
          <ResizablePanel minSize={40} className="bg-[#202020] border-4 border-l-0 border-[#333]">
            <div className="flex flex-col p-3 gap-3 h-[92.5vh] overflow-scroll">

              {/* Annotation */}
              <Card className="border-[#444] bg-[#1f1f1f] rounded-xl shadow-2xl">
                <CardHeader className="bg-[#161616] rounded-xl m-2 flex flex-row justify-between items-center">
                  <div>
                    Mosque
                  </div>
                  <div>
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 cursor-pointer text-sm"
                      onClick={() => setShowSidebar(!showSidebar)}
                    >
                      {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  
                  {/* Data */}
                  <p className='text-warp text-sm'>
                    Question ID: {JSON.stringify(annotations[activeAnnotation].questionId)}
                  </p>
 
                  <div className="flex flex-col lg:flex-row">
                    {/* Canvas */}
                    <div className="flex justify-center items-center w-[100%] lg:w-[80%]">
                      <Canvas
                        selections={annotations[activeAnnotation].selections}
                        imagePath={annotations[activeAnnotation].imagePath}
                        canvasWidth={410}
                        canvasHeight={270}
                      />
                    </div>
                    {/* Search & Filters */}
                    <div className="min-w-[200px] w-[100%] lg:w-[30%] flex flex-row lg:flex-col lg:items-center gap-2 flex-wrap">
                      <Card className="w-[100%] border-[#333] bg-[#111]">
                        <CardHeader className="m-2 p-3 bg-[#000] border-[#333] border-1 rounded-lg">
                          <b className="text-xs">Feedback Properties</b>
                        </CardHeader>
                        <CardContent className="px-3 w-[100%]">
                          <div className="w-[100%] flex justify-between">
                            <span className="text-xs font-medium">Sentiment</span>
                            <span className="text-xs font-medium">Total: {annotations[activeAnnotation].selections.find(selection => selection.aestheticValue)?.aestheticValue?.length}</span>
                          </div>
                          <div className="flex flex-col gap-1 my-2">
                            <CheckboxWithText id="good" label="Positive" />
                            <CheckboxWithText id="bad" label="Negative" />
                          </div>
                          <div className="w-[100%] flex justify-between">
                            <span className="text-xs font-medium">Category</span>
                            <span className="text-xs font-medium">Total: {annotations[activeAnnotation].selections.find(selection => selection.functionValue)?.functionValue?.length}</span>
                          </div>
                          <div className="flex flex-col gap-1 my-2">
                            <CheckboxWithText id="aesthetic" label="Aesthetic" />
                            <CheckboxWithText id="functional" label="Functional" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="w-[100%] border-[#333] bg-[#111]">
                        <CardHeader className="m-2 p-3 bg-[#000] border-[#333] border-1 rounded-lg">
                          <b className="text-xs">User Demographics</b>
                        </CardHeader>
                        <CardContent className="px-3 w-[100%]">
                          <div className="w-[100%] flex justify-between">
                            <span className="text-xs font-medium">Role</span>
                          </div>
                          <div className="flex flex-col gap-1 my-2">
                            <MultiSelect
                              className='dark:bg-[#202020] dark:border-[#1b1b1b]'
                              options={rolesList}
                              onValueChange={setSelectedRoles}
                              defaultValue={selectedRoles}
                              placeholder="Select Roles"
                              maxCount={3}
                            />
                          </div>
                          <div className="w-[100%] flex justify-between">
                            <span className="text-xs font-medium">Tenure</span>
                          </div>
                          <div className="flex flex-col gap-1 my-2">
                            <MultiSelect
                              className='dark:bg-[#202020] dark:border-[#1b1b1b]'
                              options={tenureList}
                              onValueChange={setSelectedTenures}
                              defaultValue={selectedTenures}
                              placeholder="Select Tenures"
                              maxCount={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  {/* <div className="flex gap-2">
                    <PieChartComponent title=""
                      chartData={[
                        { browser: "chrome", visitors: generateNumber(), fill: "var(--color-chrome)" },
                        { browser: "safari", visitors: generateNumber(), fill: "var(--color-safari)" },
                        { browser: "firefox", visitors: generateNumber(), fill: "var(--color-firefox)" },
                        { browser: "edge", visitors: generateNumber(), fill: "var(--color-edge)" },
                        { browser: "other", visitors: generateNumber(), fill: "var(--color-other)" },
                      ]}
                      />
                    <PieChartComponent title=""
                      chartData={[
                        { browser: "chrome", visitors: generateNumber(), fill: "var(--color-chrome)" },
                        { browser: "safari", visitors: generateNumber(), fill: "var(--color-safari)" },
                        { browser: "firefox", visitors: generateNumber(), fill: "var(--color-firefox)" },
                        { browser: "edge", visitors: generateNumber(), fill: "var(--color-edge)" },
                        { browser: "other", visitors: generateNumber(), fill: "var(--color-other)" },
                      ]}
                    />
                    <PieChartComponent title="" 
                      chartData={[
                        { browser: "chrome", visitors: generateNumber(), fill: "var(--color-chrome)" },
                        { browser: "safari", visitors: generateNumber(), fill: "var(--color-safari)" },
                        { browser: "firefox", visitors: generateNumber(), fill: "var(--color-firefox)" },
                        { browser: "edge", visitors: generateNumber(), fill: "var(--color-edge)" },
                        { browser: "other", visitors: generateNumber(), fill: "var(--color-other)" },
                      ]}
                    />
                  </div> */}
                  <div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Executive Summary */}
              <Card className="border-[#444] bg-[#1f1f1f] rounded-xl shadow-2xl">
                <CardHeader className="bg-[#161616] rounded-xl m-2">
                  <div className="flex items-center justify-between ">
                    <div>
                      <CardTitle>Executive Summary</CardTitle>
                      <CardDescription className="text-gray-400">View {activeAnnotation + 1}</CardDescription>
                    </div>
                    <div className='flex gap-2 flex-col md:flex-row'>
                      <div className='flex items-center gap-2'>
                        <Ping />
                        <span className="text-sm text-gray-400">65% Positive</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Ping />
                        <span className="text-sm text-gray-400">82% Response Rate</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Ping />
                        <span className="text-sm text-gray-400">
                          {currentAnnotationComments.length} Comments
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {/* <div className="border-t border-gray-400 mx-3"></div> */}
                <CardContent>

                    <div>
                      <h2>Key Findings</h2>
                      <p className='text-gray-400 text-sm'>
                        Overall positive sentiment (65%) with strong appreciation for modern design elements.
                        Primary concerns center around functional aspects in the upper floor layout.
                      </p>
                    </div>
                    <div className="border-t border-gray-400 my-3"></div>
                    <div>
                      <h2>Critical Analysis</h2>
                      <ul className='list-inside list-disc text-gray-400 text-sm'> 
                        <li>Storng consensus on exterior design elements, particularly in the facade treament</li>
                        <li>Mixed feedback on spatial flow, suggesting need for layout optimization</li>
                        <li>Consistent feedback across different stakeholder groups on sustainability features</li>
                      </ul>
                    </div>

                </CardContent>

                <CardFooter>
                  <div className='flex flex-col gap-2 w-[100%]'>
                    <div className='flex gap-2 flex-wrap md:flex-nowrap'>

                      <div className='bg-green-600/40 text-green-200 flex flex-col md:w-1/2 p-2'>
                        <b>Strengths</b>
                        <span className='text-sm'>
                          Modern aesthetic, sustainable materials, natural lighting
                        </span>
                      </div>

                      <div className='bg-red-500/50 text-red-200 flex flex-col md:w-1/2 p-2'>
                        <b>Area of Improvements</b>
                        <span className='text-sm'>
                          Functional layout, lack of storage, limited natural light
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Last Updated: 2 days ago</span>
                    </div>
                  </div>
                </CardFooter>

              </Card>

              {/* Feedback Comments */}
              <Card className="border-[#444] bg-[#1f1f1f] rounded-xl shadow-2xl">
                
                <CardHeader className='flex flex-row justify-between items-baseline bg-[#161616] rounded-xl mb-2 pb-3'>
                  <CardTitle>Feedback Comments</CardTitle>
                  <CardDescription className="text-gray-400">
                    Showing {currentAnnotationComments.length} comments 
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-col">
                    {/* Flat map on selections */}
                    {currentAnnotationComments
                      .flatMap((annotation) => annotation.selections)
                      .filter((selection) => selection.comment !== '' && selection.aestheticValue !== null && selection.functionValue !== null)
                      .filter((_, index) => index < 2)
                      .map((selection, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex flex-col w-[100%] border-t p-2 border-[#444]">
                          {/* {JSON.stringify(comment)} */}
                          {
                            selection.functionValue !== null &&
                            <div className='flex justify-between gap-2'>
                              <div className='w-[80%]'>
                                <div>
                                  {selection.functionValue ? '👍' : '👎'} <b>Functional</b> | Architect
                                </div>
                                <div className="text-sm text-gray-400 break-words">
                                  {selection.comment.slice(0, 40)}
                                </div>
                              </div>
                              <div className="text-sm text-gray-400 w-[20%]">
                                4 days ago
                              </div>
                            </div>
                          }

                        </div>
                        <div className="flex flex-col text-balance w-[100%] border-t p-2 border-[#444]">
                          {
                            selection.aestheticValue !== null &&
                            <div className='flex justify-between gap-2'>
                              <div className='w-[80%]'>
                                <div>
                                  {selection.aestheticValue ? '👍' : '👎'} <b>Aesthetic</b> | Designer
                                </div>
                                <div className="text-sm text-gray-400 break-words">
                                  {selection.comment.slice(0, 40)}
                                </div>
                              </div>
                              <div className="text-sm text-gray-400 w-[20%]">
                              10 days ago
                            </div>
                          </div>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </ResizablePanel>
        }
      </ResizablePanelGroup>
      
    </>
  )
}

export default App
