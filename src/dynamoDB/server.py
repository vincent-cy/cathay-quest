from flask import Flask, request, jsonify
import json
import subprocess
import os

# Initialize the Flask app
app = Flask(__name__)

# Define the path to your JSON file and import script
JSON_FILE_PATH = os.path.join('database', 'surveyResult.json')
IMPORT_SCRIPT_PATH = os.path.join('database', 'import.py')

@app.route('/api/push-results', methods=['POST'])
def push_survey_results():
    """
    API endpoint to receive survey results, save them to a file,
    and trigger the DynamoDB import script.
    """
    try:
        # 1. Get the latest survey data from the request
        latest_results = request.get_json()
        if not isinstance(latest_results, list):
            return jsonify({"status": "error", "message": "Invalid data format. Expected a JSON array."}), 400

        # 2. Save the data to the surveyResult.json file
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(latest_results, f, indent=2)
        
        print(f"Successfully saved {len(latest_results)} results to {JSON_FILE_PATH}")

        # 3. Execute the import.py script using subprocess
        print("Attempting to run the DynamoDB import script...")
        # Note: Ensure that your environment has boto3 and AWS credentials configured
        result = subprocess.run(
            ['python', IMPORT_SCRIPT_PATH],
            capture_output=True,
            text=True,
            check=True  # This will raise an exception if the script fails
        )
        
        print("Import script executed successfully.")
        print("Script output:", result.stdout)

        return jsonify({
            "status": "success", 
            "message": f"Successfully pushed {len(latest_results)} records to DynamoDB.",
            "details": result.stdout
        }), 200

    except FileNotFoundError:
        return jsonify({"status": "error", "message": f"Script not found at {IMPORT_SCRIPT_PATH}"}), 500
    except subprocess.CalledProcessError as e:
        # This catches errors from the import.py script itself
        error_message = f"The import script failed: {e.stderr}"
        print(error_message)
        return jsonify({"status": "error", "message": error_message}), 500
    except Exception as e:
        # Catch any other unexpected errors
        print(f"An unexpected error occurred: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)