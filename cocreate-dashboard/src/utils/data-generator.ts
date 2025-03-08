import { Annotation, Selection } from "@/types/global"

/**
 * Generates a random float between 0 and the specified maximum value.
 * @param max - The maximum value for the random float.
 * @returns A random float between 0 and the specified maximum value.
 */
export function getRandomFloat(max: number): number {
    return Math.random() * max
  }

/**
 * Generates a random float between the specified minimum and maximum values.
 * @param min - The minimum value for the random float.
 * @param max - The maximum value for the random float.
 * @returns A random float between the specified minimum and maximum values.
 */
export function getRandomBoundedFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Generates a random integer between 0 and the specified maximum value.
 * @param max - The maximum value for the random integer.
 * @returns A random integer between 0 and the specified maximum value.
 */
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

/**
 * Generates a random integer between the specified minimum and maximum values.
 * @param min - The minimum value for the random integer.
 * @param max - The maximum value for the random integer.
 * @returns A random integer between the specified minimum and maximum values.
 */
export function getRandomBoundedInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generates a random string of the specified length.
 * @param length - The length of the random string.
 * @returns A random string of the specified length.
 */
export function generateRandomString(length: number): string {
  return btoa(Array.from({ length }, () => String.fromCharCode(getRandomBoundedInt(65, 90))).join('')) 
}



/**
 * Generates random CoCreate data with the specified parameters.
 * @param numQuestions - The maximum number of questions to generate.
 * @param maxAnnotation - The maximum number of annotations per question.
 * @param minSelectionPerAnnotation - The minimum number of selections per annotation.
 * @param maxSelectionPerAnnotation - The maximum number of selections per annotation.
 * @param imageSize - The size of the image as a tuple [width, height].
 * @param pictureRange - The range of pictures (index) to select from. Located in the public folder.
 * @returns An array of generated annotations.
 */
export const generateCoCreateData = (
  numQuestions: number,
  maxAnnotation: number,
  minSelectionPerAnnotation: number,
  maxSelectionPerAnnotation: number,
  imageSize: [number, number],
  pictureRange: number,
) => {

  const annotations: Annotation[] = []
  const totalNumQuestions = numQuestions
  for (let i = 0; i < totalNumQuestions; i++) {
    
    const questionId = i
    const numAnnotations = getRandomBoundedInt(1, maxAnnotation)

    const imageNumber = getRandomBoundedInt(1, pictureRange)
    const imagePath = `../rendering${imageNumber}.jpg`

    
    var selectionNum = 1
    for (let z = 0; z < totalNumQuestions; z++) {
      for (let j = 0; j < numAnnotations; j++) {
        const image = ""
        const selections = generateSelections(selectionNum, minSelectionPerAnnotation, maxSelectionPerAnnotation, imageSize)
        const scaleFactor = getRandomBoundedFloat(0.5, 2)   
        annotations.push({ questionId, selections, image, imagePath, scaleFactor })
        selectionNum++
      }
    }
  }
  return annotations
}

/**
 * Generates random selections for an annotation.
 * @param minSelectionPerAnnotation - The minimum number of selections per annotation.
 * @param maxSelectionPerAnnotation - The maximum number of selections per annotation.
 * @param imageSize - The size of the image as a tuple [width, height].
 * @returns An array of generated selections.
*/
export const generateSelections = (
    selectionNum: number,
    minSelectionPerAnnotation: number,
    maxSelectionPerAnnotation: number,
    imageSize: [number, number]
  ) => {
    const selections: Selection[] = []
    const numSelections = getRandomBoundedInt(minSelectionPerAnnotation, maxSelectionPerAnnotation)
    var commentNum = 1
    for (let i = 0; i < numSelections; i++) {
      const start = { x: getRandomFloat(imageSize[0]), y: getRandomFloat(imageSize[1]) }
      const end = { x: getRandomBoundedFloat(start.x, imageSize[0]), y: getRandomBoundedFloat(start.y, imageSize[1]) }
      
      const randomFunctionValue = Math.random()
      const randomAestheticValue = Math.random()  

      const functionValue = randomFunctionValue > 0.66 ? 'good' : randomFunctionValue > 0.33 ? 'bad' : null
      const aestheticValue = randomAestheticValue > 0.66 ? 'good' : randomAestheticValue > 0.33 ? 'bad' : null

      const comment = `Selection-Comment ${selectionNum}-${commentNum} ${generateRandomString(2)}`
      commentNum++
      selections.push({ start, end, functionValue, aestheticValue, comment })
    }
    return selections
  }


export const decodeBase64Image = (dataString: string) => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  if (matches === null) {
    return new Error('Invalid input string')
  }

  if (matches.length !== 3) {
    return new Error('Invalid input string')
  }
  return Buffer.from(matches[2], 'base64')
}
