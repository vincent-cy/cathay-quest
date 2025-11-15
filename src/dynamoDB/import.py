import boto3
import json

# --- CONFIGURATION ---
AWS_REGION = 'ap-southeast-2'  # e.g., 'ap-southeast-2'
TABLE_NAME = 'InitialSurvey'
JSON_FILE_PATH = 'database/surveyResult.json' # Matches the file name from Step 3
# ---------------------

print(f"Starting import into table: {TABLE_NAME} in region: {AWS_REGION}")

try:
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
    table = dynamodb.Table(TABLE_NAME)

    # Load data from your standard JSON file
    with open(JSON_FILE_PATH, 'r', encoding='utf-8') as json_file:
        items = json.load(json_file)

    print(f"Successfully loaded {len(items)} items from the JSON file.")
    print("Beginning batch import...")

    # Use batch_writer to efficiently load items
    with table.batch_writer() as batch:
        for item in items:
            batch.put_item(Item=item)
            
    print("Batch import completed successfully.")
    print(f"Imported {len(items)} items to the table.")

except FileNotFoundError:
    print(f"Error: The file '{JSON_FILE_PATH}' was not found. Check the file path.")
except Exception as e:
    print(f"An error occurred during the DynamoDB import: {e}")

