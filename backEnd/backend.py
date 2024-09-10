from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.document_loaders import YoutubeLoader
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

@app.route('/get_transcript', methods=['GET'])
def get_transcript():
    video_url = request.args.get('video_url')
    
    if not video_url:
        return jsonify({'error': 'Missing video_url parameter'}), 400
    
    try:
        # Use the YouTubeLoader from LangChain to get the transcript
        loader = YoutubeLoader.from_youtube_url(video_url, add_video_info=True)
        documents = loader.load()

        # Extracting transcript content
        transcript_data = [
            {
                "text": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in documents
        ]

        return jsonify(transcript_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
