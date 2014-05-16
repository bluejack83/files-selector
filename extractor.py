import glob
import os

def createElement(path):
	ret = {}
	ret["text"] = path.split('/')[-2];
	return ret;

def parseFile(file):
	return createElement(file);
	pass

def parseDirectory(directory):
	ret = createElement(directory);
	ret["children"] = [];
	try:
		for element in os.listdir(directory):
			elementPath = os.path.join(directory, element);
			
			if os.path.isfile(elementPath):
				ret["children"].append(parseFile(elementPath))
			else:
				ret["children"].append(parseDirectory(elementPath+"/"))
			
	except:
		pass
		
	print ret;
	return ret;

import sys
import json
with open(sys.argv[2], 'w') as outfile:
  json.dump(parseDirectory(sys.argv[1]), outfile)		
