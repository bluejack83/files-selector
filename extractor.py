import glob
import os
import shutil
from pprint import pprint


filesCount = 0;

def copyDirectory(source,destination,data):
	global filesCount
	for child in data["children"]:
		if not child["state"]["selected"]:
			continue;
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

def normalizePath(path):
    return os.path.normpath(os.path.abspath(path));

def copy(source,destination,data):
	if(not os.path.isdir(destination)):
		raise Exception("destination is not a directory\n");
	if(not os.path.isdir(source)):
		raise Exception("source is not a directory\n");
	return copyDirectory(normalizePath(source),normalizePath(destination),data)

def propagateSelection(node):
	selected = node["state"]["selected"];
	for child in node["children"]:
		selected = selected or propagateSelection(child);
	node["state"]["selected"]=selected;
	#print node["text"]+":"+str(selected);
	return selected;

import sys
import json
import traceback

try:
	if(len(sys.argv)<4):
		raise Exception("usage: extractor [selection file] [source directory] [destination directory]\n")
	with open(sys.argv[1], 'r') as f:
		data = json.load(f)
	#data = json.load(open(sys.argv[1]))
	propagateSelection(data)
	#pprint(data)
	copy(sys.argv[2],sys.argv[3],data)
	
	print "Files extracted: "+str(filesCount);
  
except Exception, e:
	traceback.print_exc()
	print str(e)
