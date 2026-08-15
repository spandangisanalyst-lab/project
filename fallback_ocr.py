import os
import pytesseract
from PIL import Image
import google.generativeai as genai
from pdf2image import convert_from_path

def extract_text_from_file(file_path):
    # Determine if it's a PDF or Image
    is_pdf = file_path.lower().endswith('.pdf')
    
    images = []
    if is_pdf:
        try:
            # Convert first page of PDF to Image
            images = convert_from_path(file_path, first_page=1, last_page=1)
        except Exception as e:
            print(f"Failed to convert PDF to image: {e}")
            return None
    else:
        try:
            images = [Image.open(file_path)]
        except Exception as e:
            print(f"Failed to open image: {e}")
            return None

    if not images:
        return None
        
    target_image = images[0]

    # First attempt: Gemini API
    print("Attempting OCR using Gemini API...")
    try:
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))
        model = genai.GenerativeModel("gemini-3.5-flash")
        
        response = model.generate_content([
            "Extract all text from this image accurately. Return only the extracted text.", 
            target_image
        ])
        
        if response.text:
            print("Successfully extracted text using Gemini API.")
            return response.text.strip()
    except Exception as e:
        print(f"Gemini API failed or rate-limited: {e}")
        print("Automatically falling back to local PyTesseract OCR...")

    # Fallback: PyTesseract (Local OCR)
    try:
        text = pytesseract.image_to_string(target_image)
        print("Successfully extracted text using PyTesseract.")
        return text.strip()
    except Exception as tesseract_e:
        print(f"PyTesseract also failed: {tesseract_e}")
        return None

if __name__ == "__main__":
    # Example Usage
    sample_file = "sample_document.png" # or .pdf
    if os.path.exists(sample_file):
        extracted = extract_text_from_file(sample_file)
        print("\n--- Extracted Text ---\n", extracted)
    else:
        print(f"Please provide a valid file path. {sample_file} not found.")
