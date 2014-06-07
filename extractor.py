import glob
import os
import shutil
from pprint import pprint

filesCount = 0;

def copyDirectory(source,destination,data):
	pprint(data)
	if not data["state"]["selected"]:
		return;

	for child in data["children"]:
		sourcePath = os.path.join(source,child["text"])
		if child["type"]=="directory":
			destinationDirectory = os.path.join(destination,child["text"]);
			if not os.path.exists(destinationDirectory):
				os.makedirs(destinationDirectory)
			copyDirectory(sourcePath,destinationDirectory,child)
		if child["type"]=="file":
			print sourcePath
			shutil.copy(sourcePath,destination)
			filesCount=filesCount+1;

def copy(source,destination,data):
	if(not os.path.isdir(destination)):
		raise Exception("destination is not a directory\n");
	if(not os.path.isdir(source)):
		raise Exception("source is not a directory\n");
	return copyDirectory(os.path.normpath(source),os.path.normpath(destination),data)

#def propagateSelection(node):
	

import sys
import json
import traceback

try:
	if(len(sys.argv)<4):
		raise Exception("usage: extractor [selection file] [source directory] [destination directory]\n")
	with open(sys.argv[1], 'r') as f:
		data = json.load(f)
	#data = json.load(open(sys.argv[1]))
	pprint(data)
	copy(sys.argv[2],sys.argv[3],data)
	
	print "Files extracted: "+str(filesCount);
  
except Exception, e:
	traceback.print_exc()
	print str(e)
