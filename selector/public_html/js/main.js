var getTreeData = function() {
    return $.jstree.reference('#tree').get_json('#', {'flat': false})[0];
}
function stringToByteArray(str) {
    var array = new (window.Uint8Array !== void 0 ? Uint8Array : Array)(str.length);
    var i;
    var il;

    for (i = 0, il = str.length; i < il; ++i) {
        array[i] = str.charCodeAt(i) & 0xff;
    }

    return array;
}
//LZW Compression/Decompression for Strings
var LZW = {
    compress: function(uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
                dictionary = {},
                c,
                wc,
                w = "",
                result = [],
                dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }

        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays 
            //will return values for array['pop'], array['push'] etc
            // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }

        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
   },
    decompress: function(compressed) {
        "use strict";
        // Build the dictionary.
        var i,
                dictionary = [],
                w,
                result,
                k,
                entry = "",
                dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }

        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }

            result += entry;

            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);

            w = entry;
        }
        return result;
    }
}
function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || 'unknown';

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}
function SaveBlobToDisk(blobURL, fileName) {
    var reader = new FileReader();
    reader.readAsDataURL(blobURL);
    reader.onload = function(event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = fileName || 'unknown file';

        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
}
$("#treeJumbo").hide();
$("#download").hide();
var input = $("#fileInput");
input.change(
        function(eventData) {
            $("#loadJumbo").hide("slow", function() {
                $("#treeJumbo").show("slow", function() {
                    $("#download").show("slow");
                });
            });
            file = input[0].files[0];
            fileName = file.name;
            var reader = new FileReader();
            reader.onload = function(file) {

                // For Test Purposes
                fileData = LZW.decompress(JSON.parse(reader.result));

//                fileData = bzip2.simple(stringToByteArray(reader.result));

//                fileData = zlibA.inflate(reader.result);

//                var inflate = new Zlib.Inflate(reader.result);
//                fileData = inflate.decompress();

//                var gunzip = new Zlib.Gunzip(reader.result);
//                fileData = gunzip.decompress();

                //fileData = reader.result;
                var nodes = {
                    0: [
                        {id: 1, label: "My Favorite Sites", type: "folder"},
                        {id: 2, label: "Empty Folder", type: "folder"},
                        {id: 3, label: "Direct link to Google", type: "link", url: "http://www.google.com"}
                    ],
                    1: [
                        {id: 11, label: "Tech", type: "folder"},
                        {id: 12, label: "Food", type: "folder"}
                    ],
                    11: [
                        {id: 111, label: "PHP", type: "folder"},
                        {id: 112, label: "Javascript", type: "folder"},
                        {id: 113, label: "Hacker News", type: "link", url: "https://news.ycombinator.com/news"}
                    ],
                    12: [
                        // empty node
                    ],
                    111: [
                        {id: 1111, label: "PHP Engine", type: "folder"},
                        {id: 1112, label: "PHP Extension", type: "folder"},
                    ],
                    112: [
                        {id: 1121, label: "node.js", type: "link", url: "http://nodejs.org/"}
                    ],
                    1111: [
                        {id: 11111, label: "PHP: Hypertext Preprocessor", type: "link", url: "http://php.net"}
                    ],
                    1112: [
                        {id: 11121, label: "Twig", type: "link", url: "http://twig.sensiolabs.org/"}
                    ],
                    2: [
                        // empty node
                    ]
                };
                nodes = JSON.parse(fileData);
                $("#columns").hColumns({
                    searchable: true,
                    nodeSource: function(node_id, callback) {
                        if (node_id === null) {
                            node_id = 0;
                        }

                        var ret = nodes;
                        if(node_id!=0)
                            {
                                current=nodes.children[node_id[0]-1];
                                for (var i = 1; i < node_id.length; i++)
                                {
                                    current = current.children[(node_id[i]-1)];
                                }
                                ret = current;
                            }

                        return callback(null, ret.children);
                    }
                });

                $('#tree').jstree({
                    'core': {
                        'data': [
                            JSON.parse(fileData)
                        ],
                    },
                    "plugins": ["checkbox", "search", "sort", "wholerow", "types"],
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "search": {
                        "show_only_matches": true
                    },
                    types: {
                        file: {
                            icon: "img/file.png"
                        },
                        directory: {
                            icon: "img/folder.png"
                        }
                    }
                });
                var to = false;
                $('#search').keyup(function() {
                    if (event.keyCode == 13) {
                        $('#tree').jstree(true).search($('#search').val());
                    }
//                    if (to) {
//                        clearTimeout(to);
//                    }
//                    to = setTimeout(function() {
//                        var v = $('#search').val();
//                        $('#tree').jstree(true).search(v);
//                    }, 250);
                });
                //$("#save").attr("href",window.URL.createObjectURL(new Blob([fileData], { type: 'text/plain' })));
                //$("#download").attr("href", "data:application/octet-stream;charset=utf-8;base64," + window.btoa(fileData));


                var a = $("#download");
                a.click(function() {
                    var json = JSON.stringify(getTreeData());
                    var blob = new Blob([json], {type: "application/json"});
                    SaveBlobToDisk(blob, fileName);
                })
                $("#downloadify").downloadify({
                    filename: function() {
                        return "save";
                    },
                    data: getTreeData,
                    onComplete: function() {
                        alert('Your File Has Been Saved!');
                    },
                    onCancel: function() {
                        alert('You have cancelled the saving of this file.');
                    },
                    onError: function() {
                        alert('You must put something in the File Contents or there will be nothing to save!');
                    },
                    transparent: false,
                    swf: 'js/libs/downloadify/downloadify.swf',
                    downloadImage: 'img/transparent.png',
                    width: $("#save_container").outerWidth(),
                    height: $("#save_container").outerHeight(),
                    append: false,
                    transparent:true,
                });
            };
            //reader.readAsArrayBuffer(file);
            reader.readAsBinaryString(file);
        });