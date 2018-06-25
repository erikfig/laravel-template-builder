import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/pt-br';
// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';

const editor = ClassicEditor;

export default editor;

// use this in instanced editor to show all plugins actived
// console.log(Array.from( editor.ui.componentFactory.names() ));

const plugins = editor.build.plugins;
//const plugins = [Alignment].concat(editor.build.plugins);

editor.build
    .config = {
        toolbar: [
            'heading', 'alignment', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'
        ],
        language: 'pt-br'
//        toolbar: [
//            'headings', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo',
//            'imagetextalternative', 'insertimage', 'imagestylefull', 'imagestyleside'
//        ],
//        ckfinder: {
//            uploadUrl: baseURL + '/api/v1/image/upload?token=' + token
//        }
    }
