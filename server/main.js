import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import '../collections/PlexiData';


Meteor.publish('PlexiData', function () {
    return PlexiData.find();
});

Meteor.startup(() => {
    // code to run on server at startup
});

Meteor.methods({
    'plexi.setChecked'(Id, setChecked) {
        /*const plexi = PlexiData.findOne(Id);
        plexi.update(Id, { $set: { PD:{checked: setChecked }} });*/
        console.log(Id);
        console.log(setChecked);
        PlexiData.update(Id, { $set: {'PD.checked':setChecked} });
    },
    'plexi.edit'(Id, name, data, largeurTotale, base, largeurTotalePD, PDmax, LMin, LMax) {
        if (name === 'hauteurTotale'){
            data = parseFloat(data);
            // console.log(data, LMin, LMax);
            PlexiData.update(Id, {
                $set: {
                    [name]: data,
                    hauteur: data-20,
                    'debutPlaque.hauteur': (((1500-(data))/2)+(data-40)+40),
                }
            });
        }
        if (name === 'largeurTotale') {
            data = parseFloat(data);
            console.log(data, LMin, LMax);
            /*if(data<=LMin) {
                console.log("ERROR - Trop Petit");
                data = LMin;
                console.log(data);
            }
            else if(data>=LMax){
                console.log("ERROR - Trop Grand");
                data = LMax;
                console.log(data);
            }*/
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
            PlexiData.update(Id, {
                $set: {
                    [name]: data,
                    'PD.hauteur': data-40,
                }
            });
        }
        /*const plexi = PlexiData.findOne(Id);
        plexi.update(Id, { $set: { PD:{checked: setChecked }} });*/
        //console.log(name);
        //console.log(data);
        //PlexiData.update(Id, { $set: {[name]:data, name} });
    },
});
