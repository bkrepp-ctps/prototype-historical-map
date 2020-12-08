# Python script to build JSON object from event_list.csv
import csv
import json

# Function to convert a CSV file to JSON 
# Takes the file paths as arguments 
def make_json(csvFilePath, jsonFilePath): 
	# create a dictionary 
	data = {} 
	
	# Open a csv reader called DictReader 
	with open(csvFilePath, encoding='utf-8') as csvf: 
		csvReader = csv.DictReader(csvf) 
		
		for row in csvReader: 
			# The column named 'year' is kinda/sorta the primary key 
			key = rows['year']
			# Is this the first (perhaps only) time we've seen the year,
			# create an 'events' list/array in which to collect all events for that year.
			if data[key] == None:
				data[key].events = []
			# end_if
			# And push the row into the events list/array for the year
			data[key].events.append(row)
		# end_for
	#end_with

	# Open a json writer, and use the json.dumps() 
	# function to dump data 
	with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
		jsonf.write(json.dumps(data, indent=4)) 
	# end_with
# end_def make_json()

# Driver Code 

# Paths to input (CSV) and output (JSON) files:
root_dir = r'c:/Users/ben_k/work_stuff/prototype-historical-map'

csvFilePath = root_dir + '/csv/event_list.csv'
jsonFilePath = root_dir + '/output.json'

# Call the make_json function 
make_json(csvFilePath, jsonFilePath)
