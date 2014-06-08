import glob
import os

def createElement(path):
	ret = {
	  "state"       : {
		"opened"    : False,  # is the node open
		"disabled"  : False,  # is the node disabled
		"selected"  : False  # is the node selected
	  },
	  "children"    : [],  # array of strings or objects
	  "li_attr"     : {},  # attributes for the generated LI node
	  "a_attr"      : {},  # attributes for the generated A node
	  "text":os.path.split(path)[-1]
	};
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
				ret["children"].append(parseDirectory(elementPath))
			
	except:
		pass
		
	#print ret;
	return ret;

def parse(path):
  if(not os.path.isdir(path)):
    raise Exception("target is not a directory\n");
  return parseDirectory(os.path.normpath(os.path.abspath(path)))

import sys
import json
try:
  if(len(sys.argv)<3):
    raise Exception("usage: extractor [directory to parse] [output file]\n")
  with open(sys.argv[2], 'w') as outfile:
    json.dump(parse(sys.argv[1]), outfile)		
  #print parse(sys.argv[1])
except Exception, e:
  print str(e)
