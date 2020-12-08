import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'bootstrap';
import './main.html';
import '../collections/PlexiData.js';
/*
PDFDocument = require('pdfkitx');
const SVGtoPDF = require('svg-to-pdfkit');
*/





// this is equivalent to the standard node require:
//SVGtoPDF = require('svg-to-pdfkit');


function mmToPt (mm) {
    return mm * 2.83465;
}
function PtTomm (Pt) {
    return (Pt / 2.83465);
}



Meteor.subscribe('PlexiData', function () {
    return PlexiData.find();
});

Template.plexidata.helpers({
    PlexiData: function(){
        return PlexiData.find();
    }
});


Template.plexidata.events({
    'click .toggle-checked': function (event) {
        event.preventDefault();
        const state = !this.PD.checked;
        //const checked = $(event.currentTarget).data('checked');
        console.log(state);
        Meteor.call('plexi.setChecked', this._id, state);
    },
    'change input': function ( event, template ) {

        const name = $(event.target.attributes.name).val();
        let min  = $(event.target.attributes.min).val();
        let max  = $(event.target.attributes.max).val();
        let data   = $(event.target).val();
        /*console.log(name);
        console.log(min);
        console.log(max);*/
        //if (data >= min) {
        console.log(this.largeurTotaleMin);
        console.log(this.largeurTotaleMax);
        Meteor.call('plexi.edit', this._id, name, data, this.largeurTotale, this.base, this.PD.largeurTotale, this.PD.max, this.largeurTotaleMin, this.largeurTotaleMax);
    },
});

Template.svg.helpers({
    div_height: "100%",
    div_width: "100%",
    epaisseur_plexi: 3.5,
    hauteur_pied: 155,
    angle: 20,

    PlexiData: function () {
        return PlexiData.find();
    },
});
Template.svg.events({
    'click .btn-success': function (event) {
        event.preventDefault();
        const doc = new PDFDocument({size: [mmToPt(2000), mmToPt(1500)]});
        PDFDocument.prototype.addSVG = function(svg, x, y, options) {
            return SVGtoPDF(this, svg, x, y, options), this;
        };

        const SVG = document.getElementById("SVG");
        const path = SVG.firstElementChild;
        console.log(SVG.firstElementChild);
        //console.log(this);

        doc.addSVG(path, 0, 0, );
        //doc.addSpotColor('Through Cut', 50, 25, 25, 0);
        doc.write('PDFKitExampleClientSide.pdf');

        // let SVG = getElementById('SVG');
        /*const doc = new PDFDocument({size: [mmToPt(parseFloat(this.largeurTotale)), mmToPt(parseFloat(this.hauteurTotale))],});
        console.log(doc.options.size[0]);
        doc.fontSize(28);
        const X = 5;
        const Y = doc.options.size[1]-mmToPt(5);
        const debutSVG = {
            X: X,
            Y: Y
        };
        //doc.path('M' ,20 L 100,160 Q 130,200 150,120 C 190,-40 200,200 300,150 L 400,90');
        // doc.text(doc.options.size[1], 0, 32);
        if(this.PD.checked){
            doc.strokeColor('Through Cut');
            doc.path('M '+X+' '+Y+', ' +
                'v-'+mmToPt(this.hauteur)+' a20,20 0 0 1 20,-20,' +
                'h'+    mmToPt(this.largeur     )+' a20,20 0 0 1 20,20,' +
                'v'+    mmToPt(this.hauteur     )+', '+
                'h-'+   mmToPt(this.debord      )+', '+
                'v-'+   mmToPt(this.hauteurPied )+', '+
                'h-'+   mmToPt(this.epaisseur   )+', '+
                'v'+    mmToPt(this.hauteurPied )+', '+
                'h-'+   mmToPt(this.PD.base     )+', '+
                'v-'+   mmToPt(this.PD.hauteur  )+'  a20,20 0 0 0 -20,-20, '+
                'h-'+   mmToPt(this.PD.largeur  )+' a20,20 0 0 0 -20,20, '+
                'v'+    mmToPt(this.PD.hauteur  )+', '+
                'h-'+   mmToPt(this.PD.base     )+', '+
                'v-'+   mmToPt(this.hauteurPied )+', '+
                'h-'+   mmToPt(this.epaisseur   )+', '+
                'v'+    mmToPt(this.hauteurPied )+', '+
                'z').stroke();
        }else{
            doc.path('M '+X+' '+Y+', ' +
                'v-'+   mmToPt(this.hauteur)+' a20,20 0 0 1 20,-20,' +
                'h'+    mmToPt(this.largeur)+' a20,20 0 0 1 20,20,' +
                'v'+    mmToPt(this.hauteur)+', '+
                'h-'+   mmToPt(this.debord)+', '+
                'v-'+   mmToPt(this.hauteurPied)+', '+
                'h-'+   mmToPt(this.epaisseur)+', '+
                'v'+    mmToPt(this.hauteurPied)+', '+
                'h-'+   mmToPt(this.base)+', '+
                'v-'+   mmToPt(this.hauteurPied)+', '+
                'h-'+   mmToPt(this.epaisseur)+', '+
                'v'+    mmToPt(this.hauteurPied)+', '+
                'z').stroke().strokeColor('Through Cut', '#009444');

        }
        doc.write('PDFKitExampleClientSide.pdf');*/
    },
});
//db.plexidata.insert({"largeurTotale" : 400, "largeur" : 360, "hauteurTotale" : 600, "hauteur" : 560, "debutPlaque" : { "largeur" : 800, "hauteur" : 600 }, "base" : 293, "PD" : { "largeurTotale" : 250, "largeur" : 210, "hauteurTotale" : 50, "hauteur" : 30, "checked" : false } });