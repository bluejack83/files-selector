var getTreeData = function() {
    return $.jstree.reference('#tree').get_json('#', {'flat': false})[0];
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
            file = input[0].files[0];
            fileName = file.name;
            var reader = new FileReader();
            reader.onload = function(file) {
                $("#loadJumbo").hide("slow", function() {
                    $("#treeJumbo").show("slow", function() {
                        $("#download").show("slow");
                    });
                });

                fileData = reader.result;
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
                    if (to) {
                        clearTimeout(to);
                    }
                    to = setTimeout(function() {
                        var v = $('#search').val();
                        $('#tree').jstree(true).search(v);
                    }, 250);
                });
                //$("#save").attr("href",window.URL.createObjectURL(new Blob([fileData], { type: 'text/plain' })));
                //$("#download").attr("href", "data:application/octet-stream;charset=utf-8;base64," + window.btoa(fileData));

                var json = JSON.stringify(fileData);
                var blob = new Blob([json], {type: "application/json"});
                var url = URL.createObjectURL(blob);

                var a = $("#download");
//                                a.download = input.val().split("\\").pop();
//                                a.href = url;
                a.click(function() {
                    var json = JSON.stringify(getTreeData());
                    var blob = new Blob([json], {type: "application/json"});
                    SaveBlobToDisk(blob, fileName);
                    //window.location= URL.createObjectURL(blob);
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

            reader.readAsText(file);
        });