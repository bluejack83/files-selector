import glob
import os

def createElement(path):
	ret = {}
	ret["text"] = path.split('/')[-2];
	return ret;

def parseFile(file):
	ret = createElement(file);
	ret["type"] = "file";
	return ret;
	pass

def parseDirectory(directory):
	ret = createElement(directory);
	ret["children"] = [];
	ret["type"] = "directory";
	try:
		for element in os.listdir(directory):
			elementPath = os.path.join(directory, element);
			
			if os.path.isfile(elementPath):
				ret["children"].append(parseFile(elementPath))
			else:
				ret["children"].append(parseDirectory(elementPath+"/"))
			
	except:
		pass
		
	#print ret;
	return ret;

def parse(path):
  if(not os.path.isdir(path)):
    raise Exception("target is not a directory\n");
  return parseDirectory(os.path.normpath(path)+"/")

import sys
import json
try:
  if(len(sys.argv)<3):
    raise Exception("usage: extractor [directory to parse] [output file]\n")
  #with open(sys.argv[2], 'w') as outfile:
  #  json.dump(parseDirectory(sys.argv[1]), outfile)		
  print parse(sys.argv[1])
except Exception, e:
  print str(e)
