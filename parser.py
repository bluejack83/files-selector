import glob
import os

def getInt(value):
	try:
		return ord(value);
		
	except:
		return value;

def compress(uncompressed):
    """Compress a string to a list of output symbols."""
 
    # Build the dictionary.
    dict_size = 256
    dictionary = dict((chr(i), chr(i)) for i in xrange(dict_size))
    # in Python 3: dictionary = {chr(i): chr(i) for i in range(dict_size)}
 
    w = ""
    result = []
    for c in uncompressed:
        wc = w + c
        if wc in dictionary:
            w = wc
        else:
            result.append(getInt(dictionary[w]))
            # Add wc to the dictionary.
            dictionary[wc] = dict_size
            dict_size += 1
            w = c
 
    # Output the code for w.
    if w:
        result.append(getInt(dictionary[w]))
   
    return result
 
 
def decompress(compressed):
    """Decompress a list of output ks to a string."""
 
    # Build the dictionary.
    dict_size = 256
    dictionary = dict((chr(i), chr(i)) for i in xrange(dict_size))
    # in Python 3: dictionary = {chr(i): chr(i) for i in range(dict_size)}
 
    w = result = compressed.pop(0)
    for k in compressed:
        if k in dictionary:
            entry = dictionary[k]
        elif k == dict_size:
            entry = w + w[0]
        else:
            raise ValueError('Bad compressed k: %s' % k)
        result += entry
 
        # Add w+entry[0] to the dictionary.
        dictionary[dict_size] = w + entry[0]
        dict_size += 1
 
        w = entry
    return result
 
 

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
import traceback
import zlib
import bz2

def comptest(s):
    print 'original length:', len(s)
    print 'zlib compressed length:', len(zlib.compress(s))
    print 'bz2 compressed length:', len(bz2.compress(s))

def comptest2():    
    # How to use:
	compressed = compress('TOBEORNOTTOBEORTOBEORNOT')
	print (compressed)
	decompressed = decompress(compressed)
	print (decompressed)
	
try:
	#compressed = compress('TOBEORNOTTOBEORTOBEORNOT')
	#print (compressed)
	#raise Exception("end")
	if(len(sys.argv)<3):
		raise Exception("usage: extractor [directory to parse] [output file]\n")
	with open(sys.argv[2], 'w') as outfile:
		outfile.write(json.dumps(compress(json.dumps(parse(sys.argv[1])))))
		#outfile.write(json.dumps(parse(sys.argv[1])))
		#zlib.compress(json.dumps(parse(sys.argv[1])))
		#json.dump(zlib.compress(parse(sys.argv[1])), outfile)		
  #print parse(sys.argv[1])
except Exception, e:
	traceback.print_exc()
	print str(e)
