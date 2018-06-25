<template>
    <div class="container-fluid" id="email_template_builder">
        <div class="row justify-content-center" id="email_template_builder_main_row">
            <div :class="{'col-md-7' : propertiesBox == true, 'col-md-10': propertiesBox == false}" @click="openProperties($event)">
                <div class="container-fluid" id="email_template_builder_template">
                </div>
            </div>
            <div class="col-md-2" id="email_template_builder_elements">
                <div class="btn-group-horizontal">
                    <a href="" class="btn btn-primary btn-lg" @click.prevent="save()">Salvar</a>
                    <a href="" class="btn btn-primary btn-lg" id="email_template_modal_open" @click.prevent="load()">Abrir</a>
                </div>
                <hr>
                <div class="btn-group-vertical elements">
                    <a href="" class="btn btn-outline-primary btn-lg" @click.prevent data-template="<div class='row'><div class='empty-block col-md-12 email-template-builder-block'><p>Clique para editar</p></div></div>">1 coluna</a>
                    <a href="" class="btn btn-outline-primary btn-lg" @click.prevent data-template="<div class='row'><div class='empty-block col-md-6 email-template-builder-block'><p>Clique para editar</p></div><div class='empty-block col-md-6 email-template-builder-block'><p>Clique para editar</p></div></div>">2 colunas</a>
                    <a href="" class="btn btn-outline-primary btn-lg" @click.prevent data-template="<div class='row'><div class='empty-block col-md-9 email-template-builder-block'><p>Clique para editar</p></div><div class='empty-block col-md-3 email-template-builder-block'><p>Clique para editar</p></div></div>">2 colunas/esquerda</a>
                    <a href="" class="btn btn-outline-primary btn-lg" @click.prevent data-template="<div class='row'><div class='empty-block col-md-3 email-template-builder-block'><p>Clique para editar</p></div><div class='empty-block col-md-9 email-template-builder-block'><p>Clique para editar</p></div></div>">2 colunas/direira</a>
                    <a href="" class="btn btn-outline-primary btn-lg" @click.prevent data-template="<div class='row'><div class='empty-block col-md-4 email-template-builder-block'><p>Clique para editar</p></div><div class='empty-block col-md-4 email-template-builder-block'><p>Clique para editar</p></div><div class='empty-block col-md-4 email-template-builder-block'><p>Clique para editar</p></div></div>">3 colunas</a>
                </div>
            </div>
            <div class="col-md-3" v-show="propertiesBox" id="email_template_builder_properties">
                <div class="card card-default">
                    <div class="card-header">Propriedades</div>

                    <div class="card-body">
                        <legend>Conteúdo</legend>
                        <textarea id="ckeditor"></textarea>
                        <hr>
                        <legend>Cores</legend>
                        <div class="form-group">
                            <label for="email_bgcolor_changer">Cor de fundo</label>
                            <input type="color" class="input-control" id="email_bgcolor_changer" value="#ffffff">
                        </div>
                        <div class="form-group">
                            <label for="email_color_changer">Cor do texto</label>
                            <input type="color" class="input-control" id="email_color_changer" value="#000000">
                        </div>
                        <hr>
                        <legend>Borda</legend>
                        <div class="form-group">
                            <label for="email_border_color_changer">Cor do borda</label>
                            <input type="color" class="input-control" id="email_border_color_changer" value="#ffffff">
                        </div>
                        <div class="form-group">
                            <label for="email_border">Espessura</label>
                            <input type="range" class="custom-range" id="email_border" value="0">
                        </div>
                        <hr>
                        <legend>Margens</legend>
                        <div class="form-group">
                            <label for="email_padding">Margem interna</label>
                            <input type="range" class="custom-range" id="email_padding" value="0">
                        </div>
                        <div class="form-group">
                            <label for="email_margin">Margem externa</label>
                            <input type="range" class="custom-range" id="email_margin" value="0">
                        </div>
                        <hr>
                        <p>
                            <a href="" class="btn btn-danger" @click.prevent="remove()">Remover</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <templateopen/>
    </div>
</template>

<script>
import ClassicEditor from '../ckeditor';
import TemplateOpen from './TemplateOpen';
const qs = require('qs');

require("jquery-ui/ui/widgets/draggable");
require("jquery-ui/ui/widgets/droppable");
require("jquery-ui/ui/widgets/sortable");
require("jquery-ui/ui/disable-selection");

export default {
    data: function () {
        return {
            editor: null,
            propertiesBox: false,
            target: null,
            template: {}
        }
    },
    components: {
        'templateopen': TemplateOpen
    },
    methods: {
        save: function  () {
            const template = document.getElementById('email_template_builder_template').innerHTML;

            if (!template) {
                alert('Template vazio');
                return;
            }

            let title = prompt('Título do tema', this.template.title || '');
            if (!title) {
                alert('O título é obrigatório');
                return;
            }

            if (this.template.id) {
                axios.put('/email/templates/' + this.template.id, qs.stringify({title: title, template: template}))
                    .then((res) => {
                        alert('Salvo com sucesso');
                        this.template = res.data;
                    })
                    .catch((err) => console.warn('Err: ', err))

                return;
            }

            axios.post('/email/templates', qs.stringify({title: title, template: template}))
                .then((res) => {
                    alert('Salvo com sucesso');
                    this.template = res.data;
                })
                .catch((err) => console.warn('Err: ', err))
        },
        load: function () {
            const template = document.getElementById('email_template_builder_template').innerHTML;
            if (template) {
                if (!confirm('Tem certeza que quer continuar? O template atual não será salvo.')) {
                    return;
                }
            }


            $('#template-open').modal({
                backdrop: false
            });

            axios.get('/email/templates')
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => console.warn('Err: ', err))
        },
        remove: function() {
            const parent = this.target.parentElement;
            if (parent.className == 'row') {
                parent.remove();
                return;
            }
            this.target.remove();
            this.propertiesBox = false;
        },
        rgb2hex(rgb) {
            rgb = /([0-9\d]{1,}), ([0-9\d]{1,}), ([0-9\d]{1,})/.exec(rgb);
            const red = parseInt(rgb[1]);
            const green = parseInt(rgb[2]);
            const blue = parseInt(rgb[3]);
            const hex = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
            return hex;
        },
        openProperties: function(e) {
            const target = e.target.closest('.email-template-builder-block');

            if (target && this.target != target) {
                this.target = target;
                this.propertiesBox = true;
            } else if (this.target && this.target == target) {
                this.target = target;
                this.propertiesBox = !this.propertiesBox;
            } else {
                this.target = null;
                this.propertiesBox = false;
            }

            if (this.target) {
                const targetStyles = window.getComputedStyle(this.target);
                const style = {
                    borderWidth: targetStyles.borderWidth.substring(0, targetStyles.borderWidth.length - 2),
                    borderColor: this.rgb2hex(targetStyles.borderColor),
                    margin: targetStyles.margin.substring(0, targetStyles.margin.length - 2),
                    padding: targetStyles.padding.substring(0, targetStyles.padding.length - 2),
                    color: this.rgb2hex(targetStyles.color),
                    backgroundColor: this.rgb2hex(targetStyles.backgroundColor)
                };

                document.getElementById('email_border').value = style.borderWidth;
                document.getElementById('email_border_color_changer').value = style.borderColor;
                document.getElementById('email_margin').value = style.margin;
                document.getElementById('email_padding').value = style.padding;
                document.getElementById('email_color_changer').value = style.color;
                document.getElementById('email_bgcolor_changer').value = style.backgroundColor;

                this.editor.setData(this.target.innerHTML);
            }
        }
    },
    mounted() {
        const template = document.getElementById('email_template_builder_template');

        $('#email_template_builder_elements .elements a').draggable({
            helper: "clone",
            revert: true,
            revertDuration: 0
        });

        $(template).droppable({
            drop: function( e, ui ) {
                if (ui.draggable[0].dataset.template) {
                    let template = document.createElement('template');
                    template.innerHTML = ui.draggable[0].dataset.template;
                    template = template.content.childNodes;
                    template[0].setAttribute('id', 'element-' + Math.random().toString(36).substring(2));
                    e.target.appendChild(template[0])
                }
            }
        });

        $('#email_template_builder_template').sortable({
            placeholder: "ui-state-highlight"
        });
        $('#email_template_builder_template').disableSelection();

        const ckeditor = ClassicEditor
            .create(document.querySelector('#ckeditor'))
            .then(editor => {
                this.editor = editor;
                editor.editing.view.document.on('keyup', evt => this.target.innerHTML = this.editor.getData())
                editor.editing.view.document.on('click', evt => this.target.innerHTML = this.editor.getData())
            })
            .catch(err => {
                console.error(err.stack);
            });

        const email_bgcolor_changer = document.getElementById('email_bgcolor_changer');
        email_bgcolor_changer.addEventListener('change', (e) => {
            this.target.style.backgroundColor = e.target.value;
        });

        const email_color_changer = document.getElementById('email_color_changer');
        email_color_changer.addEventListener('change', (e) => {
            this.target.style.color = e.target.value;
        });

        const email_border_color_changer = document.getElementById('email_border_color_changer');
        email_border_color_changer.addEventListener('change', (e) => {
            this.target.style.borderColor = e.target.value;
            this.target.style.borderStyle = 'solid';
        });

        const email_border = document.getElementById('email_border');
        email_border.addEventListener('input', (e) => {
            this.target.style.borderWidth = e.target.value + 'px';
            this.target.style.borderStyle = 'solid';
        });

        const email_padding = document.getElementById('email_padding');
        email_padding.addEventListener('input', (e) => {
            this.target.style.padding = e.target.value + 'px';
        });

        const email_margin = document.getElementById('email_margin');
        email_margin.addEventListener('input', (e) => {
            this.target.style.margin = e.target.value + 'px';
        });
    }
}
</script>

<style scoped>
#email_template_builder {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
}
#email_template_builder_main_row, #email_template_builder_main_row > div, #email_template_builder_template {
    height: 100%;
}
#email_template_builder_elements {
    background-color: #fff;
    padding-top: 20px;
    text-align: center;
}
#email_template_builder_template {
    border: 20px solid rgba(0, 0, 0, 0);
    overflow: auto;
}
#email_template_builder_template.ui-droppable-hover {
    border: 20px solid rgba(0, 0, 0, 0.3);
    transition: ease .5s border;
}
#email_template_builder_properties {
    overflow: auto;
}
</style>
<style>
.email-template-builder-block {
    cursor: pointer;
    border: 3px solid rgba(0, 0, 0, 0);
    padding: 3px;
}
.email-template-builder-block:hover {
    border: 3px solid rgba(0, 0, 0, 0.1);
}
.ck-editor__editable {
    min-height: 260px;
}
.ui-state-highlight {
    background-color: rgba(0, 0, 0, 0.1);
    height: 20px;
}
</style>

