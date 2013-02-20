﻿function initialiseDialogBoxes() {
    $("#dialog-input-text").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
                $(this).data("dialog_ok")();
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#dialog-input-text").keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).dialog("close");
            $(this).data("dialog_ok")();
        }
    });
    $("#dialog-add-script").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 500,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
                $(this).data("dialog_ok")();
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#dialog-error").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).data("dialog_close")();
        }
    });
    $("#dialog-error").data("dialog_close", function () { });
    $("#dialog-settings").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function () {
                $("#settings-form").submit();
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#dialog-upload").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function () {
                _fileUploadSubmit();
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#dialog-imgPreview").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 500,
        height: 380,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        }
    });
}

function showDialog(prompt, defaultText, ok, list, listPrompt, autoCompleteList) {
    if (typeof list == "undefined") list = null;
    if (typeof listPrompt == "undefined") listPrompt = null;
    if (typeof autoCompleteList == "undefined") autoCompleteList = null;

    if (prompt.length > 0) {
        $("#dialog-input-text-entry").val(defaultText);
        $("#dialog-input-text-prompt").html(prompt + ":");
        $("#dialog-input-text-entry").show();
        $("#dialog-input-text-prompt").show();
    }
    else {
        $("#dialog-input-text-entry").hide();
        $("#dialog-input-text-prompt").hide();
    }

    var showList = false;
    var parent = "";
    if (list != null) {
        showList = (list.length > 1);
        if (list.length == 1) {
            parent = list[0];
        }
    }
    if (showList) {
        $("#dialog-input-text-list-prompt").html(listPrompt + ":");
        $("#dialog-input-text-options").empty();
        $.each(list, function (index, value) {
            $("#dialog-input-text-options").append($("<option/>").text(value));
        });
        $("#dialog-input-text-list").show();
    }
    else {
        $("#dialog-input-text-list").hide();
    }
    var showAutoComplete = false;
    if (autoCompleteList != null) {
        showAutoComplete = true;
        $("#dialog-input-text-entry").autocomplete({
            source: autoCompleteList
        });
    }
    $("#dialog-input-text").data("dialog_ok", function () {
        if (showList) {
            parent = $("#dialog-input-text-options option:selected").text();
        }
        if (showAutoComplete) {
            $("#dialog-input-text-entry").autocomplete("destroy");
        }
        ok($("#dialog-input-text-entry").val(), parent);
    });
    $("#dialog-input-text").dialog("open");
}

function initialiseButtons() {
    $("#button-settings").button({
        icons: { primary: "ui-icon-gear" }
    }).click(function () {
        sendAdditionalAction("main settings");
    });
    $("#button-addroom").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        addNewRoom();
    });
    $("#button-addobject").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        addNewObject();
    });
    $("#button-addpage").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        addNewPage(function (text) {
            toplevelAdditionalAction("main addpage " + text);
        });
    });
    $("#buttonset-add").buttonset();
    $("#button-undo").button({
        icons: { primary: "ui-icon-arrowreturnthick-1-w" }
    }).click(function () {
        toplevelAdditionalAction("main undo");
    });
    $("#button-redo").button({
        icons: { primary: "ui-icon-arrowreturnthick-1-e" }
    }).click(function () {
        toplevelAdditionalAction("main redo");
    });
    $("#buttonset-undoredo").buttonset();
//    $("#button-cut").button({
//        icons: { primary: "ui-icon-scissors" }
//    }).click(function () {
//        toplevelAdditionalAction("main cut");
//    });
    $("#button-copy").button({
        icons: { primary: "ui-icon-copy" }
    }).click(function () {
        toplevelAdditionalAction("main copy");
    });
    $("#button-paste").button({
        icons: { primary: "ui-icon-clipboard" }
    }).click(function () {
        toplevelAdditionalAction("main paste");
    });
    $("#buttonset-clipboard").buttonset();
    $("#button-play").button({
        icons: { primary: "ui-icon-play" }
    }).click(function () {
        var url = $(this).attr("data-url");
        window.open(url, "WebEditorPlay");
        toplevelAdditionalAction("main play");
    });
    $("#button-help").button({
        icons: { primary: "ui-icon-help" }
    }).click(function () {
        window.open("http://quest5.net/wiki/WebEditor");
    });
    $("#button-save").button({
        icons: { primary: "ui-icon-disk" }
    }).click(function () {
        sendAdditionalAction("none");
    });
}

function initialiseElementEditor() {
    finishFormSubmit();
    clearUnsavedChanges();
    var pageTitle = $("#_pageTitle").val();
    document.title = pageTitle;
    var selectTab = $("#_additionalActionTab").val();
    var refreshTreeSelectElement = $("#_refreshTreeSelectElement").val();
    if (refreshTreeSelectElement.length > 0) {
        refreshTree(refreshTreeSelectElement, selectTab);
        return;
    }
    $("#elementEditorTabs").tabs({
        create: function () {
            if (selectTab && selectTab.length > 0) {
                $("#elementEditorTabs").tabs("select", parseInt(selectTab));
            }
        },
        select: function (event, ui) {
            if (ui.tab.className == "saveBeforeLoad" && _unsavedChanges) {
                $("#_additionalAction").val("none");
                $("#_additionalActionTab").val(ui.index);
                submitForm();
            }
        }
    });
    $("#centerPane").scrollTop(0);
//    $(".stringlist-add").button({
//        icons: { primary: "ui-icon-plusthick" }
//    }).click(function () {
//        var key = $(this).attr("data-key");
//        showDialog($(this).attr("data-prompt"), "", function (text) {
//            sendAdditionalAction("stringlist add " + key + ";" + text);
//        });
//    });

    $(".stringlist-add").button({
        icons: { primary: "ui-icon-plusthick" }
    });

    $('body').on('click', '.stringlist-add', function () {
        var key = $(this).attr("data-key");
        showDialog($(this).attr("data-prompt"), "", function (text) {
            sendAdditionalAction("stringlist add " + key + ";" + text);
        });
    });

    $(".stringlist-edit").button({
        icons: { primary: "ui-icon-pencil" }
    });
    
    $('body').on('click', '.stringlist-edit', function () {
        stringListEdit($(this).attr("data-key"), $(this).attr("data-prompt"));
    });

    $(".stringlist-delete").button({
        icons: { primary: "ui-icon-trash" }
    });
    
    $('body').on('click', '.stringlist-delete', function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        sendAdditionalAction("stringlist delete " + key + ";" + selectElement.val());
    });

    $('body').on('dblclick','.stringlist', function () {
        stringListEdit($(this).attr("data-key"), $(this).attr("data-prompt"));
    });

    $(".stringlist-edit, .stringlist-delete").each(function () {
        $(this).button("disable");
    });

    $('body').on('change','.stringlist', function () {
        var editButton = $("#stringlist-" + $(this).attr("data-key") + "-edit");
        var deleteButton = $("#stringlist-" + $(this).attr("data-key") + "-delete");
        var selectElement = $("#" + this.id + " option:selected");
        if (selectElement.val() === undefined) {
            editButton.button("disable");
            deleteButton.button("disable");
        }
        else {
            editButton.button("enable");
            deleteButton.button("enable");
        }
    });

    $(".script-add").button({
        icons: { primary: "ui-icon-plusthick" }
    });
    
    $('body').on('click', '.script-add', function () {
        var key = $(this).attr("data-key");
        $("#dialog-add-script").data("key", key);
        $("#dialog-add-script").data("dialog_ok", function () {
            var create = $("#dialog-add-script-form input[type='radio']:checked").val();
            sendAdditionalAction("script add " + key + ";" + create);
        });
        $("#dialog-add-script").dialog("open");
    });

    $(".script-delete").button({
        icons: { primary: "ui-icon-trash" }
    });
    
    $('body').on('click', '.script-delete', function () {
        var key = $(this).attr("data-key");
        var selected = getSelectedScripts(key);
        if (selected.length > 0) {
            sendAdditionalAction("script delete " + key + ";" + selected);
        }
    });

    $(".script-cut").button({
        icons: { primary: "ui-icon-scissors" }
    });
    
    $('body').on('click', '.script-cut', function () {
        var key = $(this).attr("data-key");
        var selected = getSelectedScripts(key);
        if (selected.length > 0) {
            sendAdditionalAction("script cut " + key + ";" + selected);
        }
    });

    $(".script-copy").button({
        icons: { primary: "ui-icon-copy" }
    });
    
    $('body').on('click', '.script-copy', function () {
        var key = $(this).attr("data-key");
        var selected = getSelectedScripts(key);
        if (selected.length > 0) {
            sendAdditionalAction("script copy " + key + ";" + selected);
        }
    });

    $(".script-paste").button({
        icons: { primary: "ui-icon-clipboard" }
    });
    
    $('body').on('click', '.script-paste', function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("script paste " + key);
    });

    $(".script-moveup").button({
        icons: { primary: "ui-icon-arrowthick-1-n" }
    });
    
    $('body').on('click','.script-moveup',function () {
        var key = $(this).attr("data-key");
        var selected = getSelectedScripts(key);
        if (selected.length > 0) {
            sendAdditionalAction("script moveup " + key + ";" + selected);
        }
    });

    $(".script-movedown").button({
        icons: { primary: "ui-icon-arrowthick-1-s" }
    });
    
    $('body').on('click', '.script-movedown', function () {
        var key = $(this).attr("data-key");
        var selected = getSelectedScripts(key);
        if (selected.length > 0) {
            sendAdditionalAction("script movedown " + key + ";" + selected);
        }
    });

    $(".script-clipboard").buttonset();
    $(".script-move").buttonset();

    $(".script-if-add-else").button({
        icons: { primary: "ui-icon-plusthick" }
    });
    
    $('body').on('click','.script-if-add-else', function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("script addelse " + key );
    });

    $(".script-if-add-elseif").button({
        icons: { primary: "ui-icon-plusthick" }
    });
    
    $('body').on('click', '.script-if-add-elseif', function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("script addelseif " + key);
    });

    $(".script-toolbar").each(function () {
        var key = $(this).attr("data-key");
        var selectedScripts = getSelectedScripts(key);
        if (selectedScripts.length > 0) {
            $(this).show();
        }
    });

    $('body').on('click', '.script-select', function () {
        var key = $(this).attr("data-key");
        var selectedScripts = getSelectedScripts(key);
        if (selectedScripts.length > 0) {
            $("#script-toolbar-" + key).show(200);
        }
        else {
            $("#script-toolbar-" + key).hide(200);
        }
    });

    $('body').on('click', '.ifsection-select', function () {
        var key = $(this).attr("data-key");
        var selectedSections = getSelectedIfSections(key);
        if (selectedSections.length > 0) {
            $("#ifsection-toolbar-" + key).show(200);
        }
        else {
            $("#ifsection-toolbar-" + key).hide(200);
        }
    });

    $(".ifsection-delete").button({
        icons: { primary: "ui-icon-trash" }
    });
    
    $('body').on('click', '.ifsection-delete', function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("script deleteifsection " + key + ";" + getSelectedIfSections(key));
    });

    $('body').on('change', '.expression-dropdown', function () {
        var key = $(this).attr("data-key");
        var showExpression = ($(this).find('option:selected').text() == "expression");
        if (showExpression) {
            $("#" + key + "-simpleeditorspan").hide();
            $("#" + key + "-expressioneditor").show();
        }
        else {
            $("#" + key + "-expressioneditor").hide();
            $("#" + key + "-simpleeditorspan").show();
        }
    });

    $('body').on('change', '.template-dropdown', function () {
        var key = $(this).attr("data-key");
        var text = $(this).find('option:selected').text();
        if (text == "expression") {
            $("#" + key + "-templateeditor").hide();
            $("#" + key).show();
        }
        else {
            $("#_ignoreExpression").val(key);
            sendAdditionalAction("script settemplate " + key + ";" + text);
        }
    });

    $(".script-dictionary-add").button({
        icons: { primary: "ui-icon-plusthick" }
    });
    
    $('body').on('click', '.script-dictionary-add', function () {
        var key = $(this).attr("data-key");
        if ($(this).attr("data-source") == "object") {
            var possibleParents = $("#_allObjects").val().split(";");
            showDialog("", "", function (text, object) {
                sendAdditionalAction("scriptdictionary add " + key + ";" + object);
            }, possibleParents, "Add");
        }
        else {
            showDialog($(this).attr("data-prompt"), "", function (text) {
                sendAdditionalAction("scriptdictionary add " + key + ";" + text);
            });
        }
    });

    $(".error-clear").button().click(function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("error clear " + key);
    });

    $('body').on('click', '.scriptDictionarySection-select', function () {
        var key = $(this).attr("data-key");
        var selectedSections = getSelectedScriptDictionaryItems(key);
        if (selectedSections.length > 0) {
            $("#scriptDictionarySection-toolbar-" + key).show(200);
        }
        else {
            $("#scriptDictionarySection-toolbar-" + key).hide(200);
        }
    });

    $(".scriptDictionarySection-delete").button({
        icons: { primary: "ui-icon-trash" }
    });
    
    $('body').on('click','.scriptDictionarySection-delete',function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("scriptdictionary delete " + key + ";" + getSelectedScriptDictionaryItems(key));
    });

    $(".string-dictionary-add").button({
        icons: { primary: "ui-icon-plusthick" }
    });
    
    $('body').on('click','.string-dictionary-add',function () {
        stringDictionaryAdd($(this), "Add");
    });

    $(".gamebookoptions-addnew").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        addNewPage(function (text) {
            toplevelAdditionalAction("stringdictionary gamebookaddpage " + key + ";" + text);
        });
    });
    $(".gamebookoptions-link").button({
        icons: { primary: "ui-icon-link" }
    });
    
    $('body').on('click','.gamebookoptions-link',function () {
        stringDictionaryAdd($(this), "Add link to");
    });

    $('body').on('click', '.stringDictionarySection-select', function () {
        var key = $(this).attr("data-key");
        var selectedSections = getSelectedStringDictionaryItems(key);
        if (selectedSections.length > 0) {
            $("#stringDictionarySection-toolbar-" + key).show(200);
        }
        else {
            $("#stringDictionarySection-toolbar-" + key).hide(200);
        }
    });

    $(".stringDictionarySection-delete").button({
        icons: { primary: "ui-icon-trash" }
    });
    
    $('body').on('click','.stringDictionarySection-delete',function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("stringdictionary delete " + key + ";" + getSelectedStringDictionaryItems(key));
    });

    $(".multi-dropdown").change(function () {
        var key = $(this).attr("data-key");
        var value = $(this).find('option:selected').attr("value");
        sendAdditionalAction("multi set " + key + ";" + value);
    });
    $(".types-dropdown").change(function () {
        var key = $(this).attr("data-key");
        var value = $(this).find('option:selected').attr("value");
        sendAdditionalAction("types set " + key + ";" + value);
    });
    $(".elementslist-add").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var elementType = $(this).attr("data-elementtype");
        var objectType = $(this).attr("data-objecttype");
        var filter = $(this).attr("data-filter");
        addNewElement(elementType, objectType, filter);
    });
    $(".elementslist-edit").button({
        icons: { primary: "ui-icon-pencil" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        selectTreeNode(selectElement.val());
    });
    $(".elementslist-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        sendAdditionalAction("elementslist delete " + selectElement.val());
    });
    $(".elementslist-moveup").button({
        icons: { primary: "ui-icon-arrowthick-1-n" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        var previous = selectElement.attr("data-previous");
        sendAdditionalAction("elementslist swap " + selectElement.val() + ";" + previous);
    });
    $(".elementslist-movedown").button({
        icons: { primary: "ui-icon-arrowthick-1-s" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        var next = selectElement.attr("data-next");
        sendAdditionalAction("elementslist swap " + selectElement.val() + ";" + next);
    });
    $(".elementslist").change(function () {
        var editButton = $("#elementslist-edit-" + $(this).attr("data-key"));
        var deleteButton = $("#elementslist-delete-" + $(this).attr("data-key"));
        var moveupButton = $("#elementslist-moveup-" + $(this).attr("data-key"));
        var movedownButton = $("#elementslist-movedown-" + $(this).attr("data-key"));
        var selectElement = $("#" + this.id + " option:selected");
        if (selectElement.val() === undefined) {
            editButton.button("disable");
            deleteButton.button("disable");
            moveupButton.button("disable");
            movedownButton.button("disable");
        }
        else {
            editButton.button("enable");
            deleteButton.button("enable");

            var canMoveUp = (selectElement.attr("data-previous").length > 0);
            if (canMoveUp) {
                moveupButton.button("enable");
            }
            else {
                moveupButton.button("disable");
            }

            var canMoveDown = (selectElement.attr("data-next").length > 0);
            if (canMoveDown) {
                movedownButton.button("enable");
            }
            else {
                movedownButton.button("disable");
            }

            var canDelete = selectElement.attr("data-candelete") == "1";
            if (canDelete) {
                deleteButton.button("enable");
            }
            else {
                deleteButton.button("disable");
            }
        }
    });
    $(".elementslist-edit, .elementslist-delete, .elementslist-moveup, .elementslist-movedown").each(function () {
        $(this).button("disable");
    });
    $(".compass-direction").change(function () {
        var key = $(this).attr("data-key");
        setSelectedDirection(key);
    });
    $(".compass-direction-edit").button({
        icons: { primary: "ui-icon-pencil" }
    }).click(function () {
        var key = $(this).attr("data-key");
        selectTreeNode(key);
    });
    $(".compass-direction-link").click(function (e) {
        selectTreeNode($(this).html());
        e.stopPropagation();
    });
    $(".compassDirection").click(function () {
        var key = $(this).attr("data-key");
        var option = $(this).attr("data-option");
        $("#" + option).attr("checked", "checked");
        setSelectedDirection(key);
    });
    $(".compass-direction-create").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var direction = $("input:radio[name=" + key + "-compass]:checked");
        var to = $("#" + key + "-exit-data-create-to option:selected").val();
        var directionName = direction.attr("data-name");
        var inverse = direction.attr("data-inverse");
        var type = direction.attr("data-type");
        var inverseType = direction.attr("data-inversetype");
        var createInverse = $("#" + key + "-exit-data-create-inverse").is(":checked");
        if (createInverse) {
            sendAdditionalAction("exits create2 " + to + ";" + directionName + ";" + type + ";" + inverse + ";" + inverseType);
        }
        else {
            sendAdditionalAction("exits create1 " + to + ";" + directionName + ";" + type);
        }
    });
    $(".compass-direction-create-look").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var direction = $("input:radio[name=" + key + "-compass]:checked");
        var to = $("#" + key + "-exit-data-create-to option:selected").val();
        var directionName = direction.attr("data-name");
        var type = direction.attr("data-type");
        sendAdditionalAction("exits createlook " + directionName + ";" + type);
    });
    $(".exitslist-add").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        addNewElement("object", "exit", null);
    });
    $(".exitslist-edit").button({
        icons: { primary: "ui-icon-pencil" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#exitslist-" + key + " option:selected");
        selectTreeNode(selectElement.val());
    });
    $(".exitslist-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#exitslist-" + key + " option:selected");
        sendAdditionalAction("exits delete " + selectElement.val());
    });
    $(".exitslist-moveup").button({
        icons: { primary: "ui-icon-arrowthick-1-n" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#exitslist-" + key + " option:selected");
        var previous = selectElement.attr("data-previous");
        sendAdditionalAction("exits swap " + selectElement.val() + ";" + previous);
    });
    $(".exitslist-movedown").button({
        icons: { primary: "ui-icon-arrowthick-1-s" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#exitslist-" + key + " option:selected");
        var next = selectElement.attr("data-next");
        sendAdditionalAction("exits swap " + selectElement.val() + ";" + next);
    });
    $(".exitslist").change(function () {
        var editButton = $("#" + $(this).attr("data-key") + "-exit-edit");
        var deleteButton = $("#" + $(this).attr("data-key") + "-exit-delete");
        var moveupButton = $("#" + $(this).attr("data-key") + "-exit-moveup");
        var movedownButton = $("#" + $(this).attr("data-key") + "-exit-movedown");
        var selectElement = $("#" + this.id + " option:selected");
        if (selectElement.val() === undefined) {
            editButton.button("disable");
            deleteButton.button("disable");
            moveupButton.button("disable");
            movedownButton.button("disable");
        }
        else {
            editButton.button("enable");
            deleteButton.button("enable");

            var canMoveUp = (selectElement.attr("data-previous").length > 0);
            if (canMoveUp) {
                moveupButton.button("enable");
            }
            else {
                moveupButton.button("disable");
            }

            var canMoveDown = (selectElement.attr("data-next").length > 0);
            if (canMoveDown) {
                movedownButton.button("enable");
            }
            else {
                movedownButton.button("disable");
            }
        }
    });
    $(".exitslist-edit, .exitslist-delete, .exitslist-moveup, .exitslist-movedown").each(function () {
        $(this).button("disable");
    });
    $(".elementEditorCheckbox").change(function () {
        sendAdditionalAction("none")
    });
    $(".elementEditorTextbox").change(function () {
        setUnsavedChanges();
    });
    $(".elementEditorTextbox").keydown(function (e) {
        if (isCharKey(e.keyCode)) {
            setUnsavedChanges();
        }
    });
    $(".elementEditorDropdown").change(function () {
        setUnsavedChanges();
    });
    $(".verbs-add").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var availableVerbs = $("#_availableVerbs").val().split("~");
        showDialog("Please enter a name for the new verb", "", function (text) {
            sendAdditionalAction("verbs add " + key + ";" + text);
        }, null, null, availableVerbs);
    });
    $(".verbs-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        var selected = getSelectedVerbs();
        if (selected.length > 0) {
            sendAdditionalAction("verbs delete " + selected);
        }
    });
    $(".verbs-select").click(function () {
        var selected = getSelectedVerbs();
        if (selected.length > 0) {
            $(".verbs-delete").button("enable");
        }
        else {
            $(".verbs-delete").button("disable");
        }
    });
    $(".verbs-delete").button("disable");
    $(".file-upload").button({
        icons: { primary: "ui-icon-folder-open" }
    }).click(function () {
        var element = $("#_key").val();
        var key = $(this).attr("data-key");
        var extensions = $(this).attr("data-extensions");
        _fileUploadInit(element, key, extensions, $("#" + key).val());
        $("#dialog-upload").attr("data-key", key);
        $("#dialog-upload").dialog("open");
    });
    $(".img-preview").button().click(function () {
        var key = $(this).attr("data-key");
        var imgFile = $('#' + key).val();
        $('#imgPreviewElem').attr("src", "/ImageProcessor.ashx?image=" + imgFile + "&w=500&h=350&gameId=" + $("#_game_id").val());
        $('#dialog-imgPreview').dialog("open");
    });

    $("#button-move").button({
        icons: { primary: "ui-icon-extlink" }
    }).click(function () {
        var possibleParents = $("#_movePossibleParents").val().split(";");
        showDialog("", "", function (text, parent) {
            toplevelAdditionalAction("main move " + parent);
        }, possibleParents, "Move to");
    });
    $("#button-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        toplevelAdditionalAction("main delete");
    });
    $("#button-publish").button({
        icons: { primary: "ui-icon-circle-arrow-n" }
    }).click(function () {
        var url = "/Edit/Publish/" + $("#_game_id").val();
        window.open(url, "WebEditorPublish");
        toplevelAdditionalAction("main publish");
    });
    $(".elementLink").click(function () {
        var element = $(this).text();
        selectTreeNode(element);
    });

    $(".text-processor-helper").button().click(function () {
        var source = $(this).data("source");
        var insertBefore = $(this).data("insertbefore");
        var insertAfter = $(this).data("insertafter");
        var element = $("#" + $(this).data("key"));

        switch (source) {
            case "objects":
                var objects = $("#_allObjects").val().split(";");
                showDialog("", "", function (ignore, result) {
                    doInsert(element, insertBefore + result + insertAfter, "");
                }, objects, "Link to");
                break;
            case "images":
                var extensions = $(this).data("extensions");
                _fileUploadInit("", "", extensions, "");
                $("#dialog-upload").data("callback", function(result) {
                    doInsert(element, insertBefore + result + insertAfter, "");
                });
                $("#dialog-upload").dialog("open");
                break;
            default:
                doInsert(element, insertBefore, insertAfter);
        }

        function doInsert(el, before, after) {
            el.insertAtCaret(before, after);
        }
    });

    var enabledButtons = $("#_enabledButtons").val();
    updateEnabledButtons(enabledButtons);

    var popupError = $("#_popupError").val();
    if (popupError.length > 0) {
        var reload = $("#_reload").val();
        if (reload == "1") {
            $("#dialog-error").data("dialog_close", function () {
                location.reload();
            });
        }
        $("#dialog-error-message").html(popupError);
        $("#dialog-error").dialog("open");
    }

    var uiAction = $("#_uiAction").val();
    if (uiAction.length > 0) {
        var data = uiAction.split(" ");
        switch (data[0]) {
            case "settings":
                $("#dialog-settings").dialog("open");
                break;
        }
    }
}

//function deinitialiseElementEditor() {
//    $("#elementEditorTabs").tabs("destroy");
//    $(".stringlist-add").button("destroy");
//    $(".stringlist-edit").button("destroy");
//    $(".stringlist-delete").button("destroy");
//    $(".stringlist").unbind("dblclick");
//    $(".stringlist").unbind("change");
//    $(".script-add").button("destroy");
//    $(".script-delete").button("destroy");
//    $(".script-cut").button("destroy");
//    $(".script-copy").button("destroy");
//    $(".script-paste").button("destroy");
//    $(".script-moveup").button("destroy");
//    $(".script-movedown").button("destroy");
//    $(".script-if-add-else").button("destroy");
//    $(".script-if-add-elseif").button("destroy");
//    $(".script-select").unbind("click");
//    $(".ifsection-select").unbind("click");
//    $(".ifsection-delete").button("destroy");
//    $(".expression-dropdown").unbind("change");
//    $(".template-dropdown").unbind("change");
//    $(".script-dictionary-add").button("destroy");
//    $(".error-clear").button("destroy");
//    $(".scriptDictionarySection-select").unbind("click");
//    $(".scriptDictionarySection-delete").button("destroy");
//    $(".string-dictionary-add").button("destroy");
//    $(".gamebookoptions-addnew").button("destroy");
//    $(".gamebookoptions-link").button("destroy");
//    $(".stringDictionarySection-select").unbind("click");
//    $(".stringDictionarySection-delete").button("destroy");
//    $(".multi-dropdown").unbind("change");
//    $(".types-dropdown").unbind("change");
//    $(".elementslist-add").button("destroy");
//    $(".elementslist-edit").button("destroy");
//    $(".elementslist-delete").button("destroy");
//    $(".elementslist-moveup").button("destroy");
//    $(".elementslist-movedown").button("destroy");
//    $(".elementslist").unbind("change");
//    $(".compass-direction").unbind("change");
//    $(".compass-direction-edit").button("destroy");
//    $(".compass-direction-link").unbind("click");
//    $(".compassDirection").unbind("click");
//    $(".compass-direction-create").button("destroy");
//    $(".compass-direction-create-look").button("destroy");
//    $(".exitslist-add").button("destroy");
//    $(".exitslist-edit").button("destroy");
//    $(".exitslist-delete").button("destroy");
//    $(".exitslist-moveup").button("destroy");
//    $(".exitslist-movedown").button("destroy");
//    $(".exitslist").unbind("change");
//    $(".elementEditorCheckbox").unbind("change");
//    $(".elementEditorTextbox").unbind("change");
//    $(".elementEditorTextbox").unbind("keydown");
//    $(".elementEditorDropdown").unbind("change");
//    $(".verbs-add").button("destroy");
//    $(".verbs-delete").button("destroy");
//    $(".verbs-select").unbind("click");
//    $(".file-upload").button("destroy");
//    $("#button-move").button("destroy");
//    $("#button-delete").button("destroy");
//    $("#button-publish").button("destroy");
//    $(".elementLink").unbind("click");
//}

function stringDictionaryAdd(button, prompt) {
    var key = button.attr("data-key");
    if (button.attr("data-source") == "object") {
        var possibleParents = $("#_allObjects").val().split(";");
        var exclude = button.attr("data-source-exclude");
        possibleParents = $.grep(possibleParents, function (value) {
            return (value != exclude);
        });
        showDialog("", "", function (text, object) {
            sendAdditionalAction("stringdictionary add " + key + ";" + object);
        }, possibleParents, prompt);
    }
    else {
        showDialog(button.attr("data-prompt"), "", function (text) {
            sendAdditionalAction("stringdictionary add " + key + ";" + text);
        });
    }
}

function setSelectedDirection(key) {
    var selected = $("input:radio[name=" + key + "-compass]:checked");
    var value = selected.val();
    var name = selected.attr("data-name");
    var to = selected.attr("data-to");
    var elementId = selected.attr("data-id");
    var lookonly = selected.attr("data-lookonly") == "1";
    $("#" + key + "-exit-data").show();
    $("#" + key + "-exit-data-name").html(capFirst(name));
    if (elementId.length > 0) {
        if (lookonly) {
            $("#" + key + "-exit-data-to").html("(look)");
        }
        else {
            $("#" + key + "-exit-data-to").html(to);
        }
        $("#" + key + "-exit-data-edit").attr("data-key", elementId);
        $("#" + key + "-exit-data-create").hide();
        $("#" + key + "-exit-data-existing").show();
    }
    else {
        $("#" + key + "-exit-data-existing").hide();
        $("#" + key + "-exit-data-create").show();
    }
}

function getSelectedScripts(key) {
    return getSelectedItems(key, ".script-select", 10);
}

function getSelectedIfSections(key) {
    return getSelectedItems(key, ".ifsection-select", 17);
}

function getSelectedScriptDictionaryItems(key) {
    return getSelectedItems(key, ".scriptDictionarySection-select", 18);
}

function getSelectedStringDictionaryItems(key) {
    return getSelectedItems(key, ".stringDictionarySection-select", 18);
}

function getSelectedVerbs() {
    var result = "";
    $(".verbs-select").each(function (index, element) {
        var e = $(element);
        var id = e.attr("id");
        if (e.is(":checked")) {
            if (result.length > 0) result += ";";
            result += id.substring(13);
        }
    });
    return result;
}

function getSelectedItems(key, checkboxClass, prefixLength) {
    var result = "";
    $(checkboxClass).each(function (index, element) {
        var e = $(element);
        var id = e.attr("id");
        var checkboxKey = e.attr("data-key");
        if (checkboxKey == key && e.is(":checked")) {
            if (result.length > 0) result += ";";
            result += id.substring(prefixLength + key.length);
        }
    });
    return result;
}

function stringListEdit(key, prompt) {
    var selectElement = $("#select-" + key + " option:selected");
    var oldValue = selectElement.text();
    showDialog(prompt, oldValue, function (newValue) {
        if (oldValue != newValue) {
            sendAdditionalAction("stringlist edit " + key + ";" + selectElement.val() + ";" + newValue);
        }
    })
}

function sendAdditionalAction(action) {
    $("#_additionalAction").val(action);
    $("#_additionalActionTab").val($("#elementEditorTabs").tabs('option', 'selected'));
    submitForm();
}

function updateEnabledButtons(buttons) {
    var enabledButtons = buttons.split(";");
    updateButton(enabledButtons, "undo", $("#button-undo"));
    updateButton(enabledButtons, "redo", $("#button-redo"));
    updateButton(enabledButtons, "delete", $("#button-delete"));
    //updateButton(enabledButtons, "cut", $("#button-cut"));
    updateButton(enabledButtons, "copy", $("#button-copy"));
    updateButton(enabledButtons, "paste", $("#button-paste"));
}

function updateButton(enabledButtons, label, button) {
    if ($.inArray(label, enabledButtons) == -1) {
        button.button("disable");
    }
    else {
        button.button("enable");
    }
}

function ajaxError() {
    finishFormSubmit();
    $("#dialog-error").data("dialog_close", function () {
        location.reload();
    });
    $("#dialog-error-message").html("Sorry, an internal error occurred.");
    $("#dialog-error").dialog("open");
}

function addNewElement(elementType, objectType, filter) {
    switch (elementType) {
        case "object":
            switch (objectType) {
                case "object":
                    addNewObject();
                    break;
                case "exit":
                    addNewExit();
                    break;
                case "command":
                    if (filter == "verb") {
                        alert("To do: verb");
                    }
                    else {
                        addNewCommand();
                    }
                    break;
                case "turnscript":
                    addNewTurnScript();
                    break;
                default:
                    alert("Unhandled: " + objectType);
                    break;
            }
            break;
        case "function":
            addNewFunction();
            break;
        case "timer":
            addNewTimer();
            break;
        case "walkthrough":
        case "include":
        case "template":
        case "dynamictemplate":
        case "type":
        case "javascript":
            alert("To do: " + elementType);
            break;
        default:
            alert("Unhandled: " + elementType);
            break;
    }
}

function addNewRoom() {
    showDialog("Please enter a name for the new room", "", function (text) {
        toplevelAdditionalAction("main addroom " + text);
    });
}

function addNewObject() {
    var possibleParentsSource = $("#_newObjectPossibleParents").val().split(";");
    var key = $("#_key").val();
    var possibleParents = new Array();
    for (idx in possibleParentsSource) {
        var value = possibleParentsSource[idx];
        if (value == key) {
            value = $("#name").val();
        }
        possibleParents.push(value);
    }
    showDialog("Please enter a name for the new object", "", function (text, parent) {
        toplevelAdditionalAction("main addobject " + text + ";" + parent);
    }, possibleParents, "Parent");
}

function addNewPage(action) {
    showDialog("Please enter a name for the new page", $("#_nextPage").val(), action);
}

function addNewExit() {
    toplevelAdditionalAction("main addexit");
}

function addNewFunction() {
    showDialog("Please enter a name for the new function", "", function (text) {
        toplevelAdditionalAction("main addfunction " + text);
    });
}

function addNewTimer() {
    showDialog("Please enter a name for the new timer", "", function (text) {
        toplevelAdditionalAction("main addtimer " + text);
    });
}

function addNewTurnScript() {
    toplevelAdditionalAction("main addturnscript");
}

function addNewCommand() {
    toplevelAdditionalAction("main addcommand");
}

function selectTreeNode(node) {
    $("#gameTree").jstree("select_node", "#tree-" + node.replace(/ /g, "-"), true);
}

function capFirst(text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}

var _fileUploadInit = null;
var _fileUploadSubmit = null;

function registerFileUploadInit(initFn) {
    _fileUploadInit = initFn;
}

function registerFileUploadSubmit(submitFn) {
    _fileUploadSubmit = submitFn;
}

function filePosted(file) {
    $("#dialog-upload").dialog("close");
    var key = $("#dialog-upload").attr("data-key");
    if (key) {
        $("#" + key).val(file);
    } else {
        var callback = $("#dialog-upload").data("callback");
        callback(file);
    }
    sendAdditionalAction("none");
}

var delayWorkingDisplay = null;

function beginFormSubmit() {
    $("body").addClass("waiting");
    delayWorkingDisplay = setTimeout(function () {
        $("#form-loading").show();
    }, 250);
}

function finishFormSubmit() {
    $("body").removeClass("waiting");
    clearTimeout(delayWorkingDisplay);
    $("#form-loading").hide();
}

function setUnsavedChanges() {
    _unsavedChanges = true;
    $("#button-save").button("enable");
    $("#button-save").button("option", "icons", { primary: "ui-icon-disk" });
    $("#button-save").button("option", "label", "Save");
}

function clearUnsavedChanges() {
    _unsavedChanges = false;
    $("#button-save").button("disable");
    $("#button-save").button("option", "icons", { primary: "ui-icon-check" });
    $("#button-save").button("option", "label", "Saved");
}

function isCharKey(keyCode) {
    if (keyCode == 8 /*backspace */
            || keyCode == 13 /* enter */
            || (keyCode >= 46 && keyCode <= 90) /* delete, 0-9, a-z */
            || (keyCode >= 96 && keyCode <= 111) /* numpad */
            || (keyCode >= 186 && keyCode <= 222) /* punctuation */
        ) {
        return true;
    }
    return false;
}

$.fn.insertAtCaret = function (textBefore, textAfter) {
    // based on from http://stackoverflow.com/questions/4456545/how-to-insert-text-at-the-current-caret-position-in-a-textarea
    return this.each(function () {
        if (document.selection && this.tagName == 'TEXTAREA') {
            //IE textarea support
            this.focus();
            var sel = document.selection.createRange();
            sel.text = textBefore + textAfter;
            this.focus();
        } else if (this.selectionStart || this.selectionStart == '0') {
            //MOZILLA/NETSCAPE support
            var startPos = this.selectionStart;
            var endPos = this.selectionEnd;
            var scrollTop = this.scrollTop;
            this.value = this.value.substring(0, startPos) + textBefore + textAfter + this.value.substring(endPos, this.value.length);
            this.focus();
            this.selectionStart = startPos + textBefore.length;
            this.selectionEnd = startPos + textBefore.length;
            this.scrollTop = scrollTop;
        } else {
            // IE input[type=text] and other browsers
            this.value += textBefore + textAfter;
            this.focus();
            this.value = this.value;    // forces cursor to end
        }
    });
};