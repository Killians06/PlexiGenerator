import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '../collections/PlexiData';

Meteor.publish('PlexiData', function () {
    return PlexiData.find();
});

Meteor.startup(() => {
    // code to run on server at startup
    let count = PlexiData.find().count();
    console.log(count);
    if (count===0){
        console.log("Pas de Collection!");
        PlexiData.insert({
            "commandID":"10985",
            "largeurTotale":400,
            "largeur":360,
            "hauteurTotale":400,
            "hauteur":380,
            "debord":30,
            "hauteurPied":155,
            "epaisseur":3.5,
            "largeurTotaleMax":2000,
            "hauteurTotaleMax":1500,
            "largeurTotaleMin":400,
            "hauteurTotaleMin":400,
            "debutPlaque":{
                "largeur":800,
                "hauteur":950
            },
            "base":333,
            "PD":{"largeurTotale":230,
                "largeur":190,
                "hauteurTotale":230,
                "hauteur":210,
                "checked":true,
                "base":51.5,
                "min":100,
                "max":230
            }
        })
    }
});

Meteor.methods({
    'plexi.setChecked'(Id, setChecked) {
        PlexiData.update(Id, { $set: {'PD.checked':setChecked} });
    },
    'plexi.edit'(Id, name, data, largeurTotale, hauteurTotale, base, largeurTotalePD, hauteurTotalePD, PDmax, LMin, LMax) {
        if (name === 'commandID'){
            PlexiData.update(Id, {
                $set: {
                    [name]: data,
                }
            });
        }
        if (name === 'hauteurTotale'){
            data = parseFloat(data);
            if(data < 400){
                data = 400;
            }
            if (data-170<hauteurTotalePD){
                PlexiData.update(Id, {
                    $set: {
                        [name]: data,
                        hauteur: data-20,
                        'debutPlaque.hauteur': (((1500-(data))/2)+(data-40)+40),
                        'PD.hauteurTotale': data-170,
                        'PD.hauteur': data-170-20
                    }
                });
            }else if(data-170>hauteurTotalePD) {
                PlexiData.update(Id, {
                    $set: {
                        [name]: data,
                        hauteur: data - 20,
                        'debutPlaque.hauteur': (((1500 - (data)) / 2) + (data - 40) + 40),
                    }
                });
            }

        }
        if (name === 'largeurTotale') {
            data = parseFloat(data);
            console.log(data, LMin, LMax);
            if(data>LMax) {
                console.log("ERROR - Trop Grand");
                data = LMax;
                console.log(data);
            }
            if(data<LMin) {
                console.log("ERROR - Trop Petit");
                data = LMin;
                console.log(data);
            }
            if (data-largeurTotalePD < 170) {
                PlexiData.update(Id, {
                    $set: {
                        [name]: data,
                        'PD.largeurTotale': data-170,
                        'PD.largeur': data-170-40,
                        'PD.base': ((data-(data-170)-60-7)/2),
                        largeur: data - 40,
                        base: (data-60-7),
                        'debutPlaque.largeur': ((2000 - data) / 2),
                        'PD.max': data - 170,
                    }
                })
            }
            else if (data - largeurTotalePD > 170) {
                PlexiData.update(Id, {
                    $set: {
                        [name]: data,
                        largeur: data - 40,
                        'debutPlaque.largeur': ((2000 - data) / 2),
                        base: (data-60-7),
                        'PD.base': (((data-60-7)-(largeurTotalePD)) / 2),
                        'PD.max': data - 170,
                    }
                })
            }
        }
        if (name === 'PD.largeurTotale'){
            data = parseFloat(data);
            if( data >= PDmax){
                data = largeurTotale - 170;
                PlexiData.update(Id, {
                    $set: {
                        'PD.max': data,
                    }
                })

            }
            if( data<100 ){
                data=100
            }
            PlexiData.update(Id, {
                $set: {
                    [name]: data,
                    'PD.largeur': data-40,
                    'PD.base': (((largeurTotale-data-60-7)/2))
                }
            });
        }
        if (name === 'PD.hauteurTotale'){
            data = parseFloat(data);
            if (data>hauteurTotale-170){
                data=hauteurTotale-170;
            }
            if( data>500 ){
                data=500;
            }
            PlexiData.update(Id, {
                $set: {
                    [name]: data,
                    'PD.hauteur': data-20,
                }
            });
        }
    },
});
