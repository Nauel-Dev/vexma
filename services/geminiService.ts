export const generateLoveNote = async (): Promise<string> => {
  // Simulate a small delay for the "writing" effect
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return "My heart is doing a happy dance because you said YES! 💘 I can’t wait to spend the sweetest day ever with my favorite person. 🏹✨";
};