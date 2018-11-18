//app
const express = require('express')
const app = express()

// middleware
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

//model
const Esal = require('../models/esal');
//==========================
//Mostrar todas las ESAL
//==========================
app.get('/esal', function(req, res) {


        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        //q campos qremos mostrar
        Esal.find({ estado: true }, 'nombre img googlemaps direccion tipoEsal telefono facebook sitioWeb youtubeChannel municipio departamento pais usuario estado')
            .populate('tipoEsal')
            .populate('usuario')
            .skip(desde)
            .limit(limite)
            .exec((err, esals) => {

                if (err) {

                    return res.status(500).json({
                        ok: false,
                        err
                    });

                }
                Esal.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        esals,
                        cuantos: conteo
                    });

                });



            });


    })
    //==========================
    //Mostrar una ESAL por id
    //==========================
app.get('/esal/:id', function(req, res) {

    let id = req.params.id;

    Esal.findById(id, (err, esalDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!esalDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            esal: esalDB
        })

    });


})

//==========================
//Buscar ESAL por termino
//==========================

app.get('/esal/buscar/:termino', verificaToken, function(req, res) {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');



    //q campos qremos mostrar
    Esal.find({ nombre: RegExp, estado: true })
        .populate('tipoEsal')
        .populate('usuario')
        .exec((err, esals) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            Esal.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    esals,
                    cuantos: conteo
                });

            });


        });




});





//==========================
//Crear nueva ESAL
//==========================	
//crear nuevos registros
app.post('/esal', [verificaToken, verificaAdminRole], function(req, res) {


        let body = req.body;

        let esal = new Esal({

            nombre: body.nombre,
            img: body.img,
            googlemaps: body.googlemaps,
            direccion: body.direccion,
            tipoEsal: body.tipoEsal,
            telefono: body.telefono,
            facebook: body.facebook,
            sitioWeb: body.sitioWeb,
            youtubeChannel: body.youtubeChannel,
            municipio: body.municipio,
            departamento: body.departamento,
            pais: body.pais,
            usuario: req.usuario._id,
            estado: body.estado

        });

        esal.save((err, esalDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!esalDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });


            }

            res.json({
                ok: true,
                esal: esalDB
            })


        });
    })
    //==========================
    //Actualizar ESAL
    //==========================	

app.put('/esal/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    Esal.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, esalDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!esalDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            esal: esalDB
        })
    });
})

//==========================
//Actualizar ESAL
//==========================	
app.delete('/esal', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, esalDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!esalDB) {
            return res.status(400).json({
                ok: false,
                err
            });


        }

        res.json({
            ok: true,
            esal: esalDB
        })
    });





})

module.exports = app;