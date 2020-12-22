import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'bootstrap';
import './main.html';
import '../collections/PlexiData.js';

// this is equivalent to the standard node require:
const SVGtoPDF = require('svg-to-pdfkit');
function mmToPt (mm) {
    return mm * 2.83465;
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
        console.log(state);
        Meteor.call('plexi.setChecked', this._id, state);
    },
    'change input': function ( event, template ) {
        const name = $(event.target.attributes.name).val();
        let min  = $(event.target.attributes.min).val();
        let max  = $(event.target.attributes.max).val();
        let data   = $(event.target).val();
        console.log(this.largeurTotaleMin);
        console.log(this.largeurTotaleMax);
        Meteor.call('plexi.edit', this._id, name, data, this.largeurTotale, this.hauteurTotale, this.base, this.PD.largeurTotale,this.PD.hauteurTotale, this.PD.max, this.largeurTotaleMin, this.largeurTotaleMax);
    },
    'click .btn-success': function (event) {
        event.preventDefault();
        const doc = new PDFDocument({size: [mmToPt(2000), mmToPt(1500)]});
        const SVG = document.getElementById("SVG");
        const path = SVG.firstElementChild;
        doc.addSVG = function (svg, x, y, options) {
            return SVGtoPDF(this, svg, x, y, options({
                //colorCallback: newColor
            }));
        };
        SVGtoPDF(doc, path, 0, 0);
        console.log(doc);
        if (this.PD.checked){
            doc.write(this.commandID +' - Plexi 3mm - '+ this.largeurTotale +'x'+ this.hauteurTotale +' - PD '+ this.PD.largeurTotale +'x'+ this.PD.hauteurTotale +'.pdf');
        }
        else{
            doc.write(this.commandID +' - Plexi 3mm - '+ this.largeurTotale +'x'+ this.hauteurTotale +'.pdf');
        }
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

});
//db.plexidata.insert({"largeurTotale" : 400, "largeur" : 360, "hauteurTotale" : 600, "hauteur" : 560, "debutPlaque" : { "largeur" : 800, "hauteur" : 600 }, "base" : 293, "PD" : { "largeurTotale" : 250, "largeur" : 210, "hauteurTotale" : 50, "hauteur" : 30, "checked" : false } });