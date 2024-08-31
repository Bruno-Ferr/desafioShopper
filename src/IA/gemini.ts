const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  // Choose a Gemini model.
  model: "gemini-1.5-flash",
});
export async function Teste(image: string) { //Receber a imagem. Talvez qual é o tipo da medição (água ou gas tbm)
  const uploadResponse = await fileManager.uploadFile(`public/${image}`, {
    mimeType: "image/jpeg"
  });

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri
      }
    },
    { text: `This is a photo from an water/gas measure from brazil. I need you to extract the value (JUST THE NUMBER) of the consumption of water or gas that is displayed in the image. 
      If the image is not one of the two type (gas or water) or is not in a good quality to realize the extraction, just return 'Invalid image'.` },
  ]);

  return result.response.text()
}
