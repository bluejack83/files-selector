import glob
import os
import shutil
	
def copyDirectory(source,destination,data):
	if not data["selected"]:
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
			filesCount++;

def copy(source,destination,data):
	if(not os.path.isdir(destination)):
		raise Exception("destination is not a directory\n");
	if(not os.path.isdir(source)):
		raise Exception("source is not a directory\n");
	return copyDirectory(os.path.normpath(source),os.path.normpath(destination),data)

import sys
import json
from pprint import pprint

try:
	if(len(sys.argv)<4):
		raise Exception("usage: extractor [selection file] [source directory] [destination directory]\n")
	data = json.load(open(sys.argv[1]))
	pprint(data)
	copy(sys.argv[2],sys.argv[3],data)
	print "Files extracted: "+filesCount;
  
except Exception, e:
	print str(e)
