var dvp = {
    templates: {},
    atHome: true,
    ctx: {
        root01: 'none',
        root02: 'none',
        level: '',
        items: ''
    },
    googleMapsState: "",
    iscroll: null
};
dvp.initialize = function () {
    this.templates.home = Handlebars.compile($("#hbt-home").html());
    this.templates.level01 = Handlebars.compile($("#hbt-level01").html());
    this.templates.level02 = Handlebars.compile($("#hbt-level02").html());
    this.templates.level03 = Handlebars.compile($("#hbt-level03").html());
    this.templates.contact = Handlebars.compile($("#hbt-contact").html());
    this.templates.aboutlist = Handlebars.compile($("#hbt-about-list").html());
    this.templates.whois = Handlebars.compile($("#hbt-about-whois").html());
    this.templates.texts = Handlebars.compile($("#hbt-about-texts").html());
    this.templates.evolution = Handlebars.compile($("#hbt-about-evolution").html());
    this.templates.mapping = Handlebars.compile($("#hbt-mapping").html());
    this.templates.searchs = Handlebars.compile($("#hbt-mapping").html());
};
dvp.isOffline = function () {
    var connectionType = navigator.connection ? navigator.connection.type : null;
    return connectionType !== null && (connectionType == Connection.NONE || connectionType == Connection.UNKNOWN);
};
dvp.toggleClickEvent = function () {
    return $.device.mobile ? 'singleTap' : 'click';
};
dvp.showAlert = function (message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
};
dvp.handleDANEWebpageAccess = function () {
    $('body').on(dvp.toggleClickEvent(), '.danelogo1', function (e) {
        e.preventDefault();
        window.open('http://www.dane.gov.co', '_system');
    });
};
dvp.handleSearchBox = function () {
    $('body').on(dvp.toggleClickEvent(), 'button#search-btn', function (e) {
        e.preventDefault();
        var searchtext = $('input#search-text').val() || 'nah';
        if (searchtext !== 'nah') {
            var resultList = [];
            dvp.showAlert('texto: ' + searchtext, 'Buscar');
        }else{
            dvp.showAlert('Ingrese un texto.','Buscar');
        }
    });
};
dvp.prepareMainView = function () {
    var searchMenu = [
        {
            label: 'Departamentos',
            hash: 'deptos'
        }, {
            label: 'Áreas Metropolitanas',
            hash: 'armtrps'
        }, {
            label: 'Distritos',
            hash: 'dstrts'
        }, {
            label: 'Datos de interes',
            hash: 'about'
        }, {
            label: 'Contáctenos',
            hash: 'contact'
        }
    ];

    $('body').html(this.templates.home({
        upperTip: "Seleccione por código",
        menu: searchMenu
    }));

    $('body').off(dvp.toggleClickEvent()).on(dvp.toggleClickEvent(), 'li.home-menu-item', function (e) {
        e.preventDefault();
        var hash = $(this).attr('data-home-link') || 'nah';
        dvp.changeView(hash);
    });
    dvp.handleDANEWebpageAccess();
    dvp.handleSearchBox();
};
dvp.changeView = function (hash, context) {
    $('body').off(dvp.toggleClickEvent());
    dvp.atHome = false;
    if (hash === 'deptos') {
        dvp.prepareRootGeographiesMainView('depto');
    } else if (hash === 'armtrps') {
        dvp.prepareRootGeographiesMainView('armtrp');
    } else if (hash === 'dstrts') {
        dvp.prepareRootGeographiesMainView('dstrt');
    } else if (hash === 'mpios' || hash === 'cpobs') {
        dvp.prepareInnerGeographiesMainView(hash, context);
    } else if (hash === 'about') {
        dvp.prepareAboutListingView();
    } else if (hash === 'contact') {
        dvp.prepareContactInfoView();
    }

    if (dvp.iscroll !== null) {
        dvp.iscroll.destroy();
        dvp.iscroll = null;
    }
    dvp.iscroll = new iScroll("wrapper");

    $('body').on(dvp.toggleClickEvent(), 'img.back-home-icon', function (e) {
        e.preventDefault();
        dvp.atHome = true;
        dvp.prepareMainView();
    }).on(dvp.toggleClickEvent(), 'img.vmap-icon', function (e) {
        e.preventDefault();
        var btn = $(this);
        dvp.prepareMappingView(btn);
    }).on(dvp.toggleClickEvent(), 'img.save-xls-icon', function (e) {
        e.preventDefault();
        dvp.prepareInformationForXlsSaving();
    }).on(dvp.toggleClickEvent(), 'img.back-prev-icon', function (e) {
        e.preventDefault();
        var prev_page = $('#prev-page').val() || 'none';
        if (prev_page === 'home') {
            dvp.atHome = true;
        dvp.prepareMainView();
        }else{
            dvp.changeView(prev_page);
        }
    });
    dvp.handleDANEWebpageAccess();
};
dvp.prepareRootGeographiesMainView = function (rootScope) {
    var context = {};
    if (rootScope === 'depto') {
        context = {
            treeline: 'departamentos',
            upperTip: "Códigos por departamento",
            tip_bog: "Nota: No se debe tener en cuenta a Bogotá D.C. como departamento.",
            list: data.departamentos
        };
        dvp.ctx.level='01';
    } else if (rootScope === 'armtrp') {
        context = {
            treeline: 'areasmetrop',
            upperTip: "Códigos por área metropolitana",
            list: data.areasmetrop
        };
        dvp.ctx.level='02';
    } else if (rootScope === 'dstrt') {
        context = {
            treeline: 'distritos',
            upperTip: "Códigos por distritos",
            list: data.distritos
        };
        dvp.ctx.level='03';
    }
    dvp.ctx.root01 = 'none';
    dvp.ctx.root02 = 'none';
    $('body').html(this.templates.level01(context));
    $('li.item-li').addClass(rootScope + 's-li');
    if (rootScope !== 'depto') {
        $('.vmap-icon').remove();
    }
    $('body').on(dvp.toggleClickEvent(), 'li.' + rootScope + 's-li a.itm-nom', function (e) {
        e.preventDefault();
        var code = $(this).attr('data-itm-cod') || 'nah';
        dvp.changeView('mpios', {
            scope: rootScope,
            code: code
        });
    });
};
dvp.prepareInnerGeographiesMainView = function (hash, context) {
    var mpios = null;
    var cpoblds = null;
    if (hash === 'mpios') {
        mpios = $.grep(data.municipios, function (item, index) {
            return item[context.scope] === context.code;
        });
        dvp.ctx.level='04';
    } else if (hash === 'cpobs') {
        cpoblds = $.grep(data.cpoblados, function (item, index) {
            return item['mpio'] === context.mpio;
        });
        dvp.ctx.level='05';
    }
    var scope_name = "";
    var scope_field = "";
    if (context.scope === 'depto') {
        scope_name = "Departamentos";
        scope_field = "departamentos";
    } else if (context.scope === 'armtrp') {
        scope_name = "Áreas metropolitanas";
        scope_field = "areasmetrop";
    } else if (context.scope === 'dstrt') {
        scope_name = "Distritos";
        scope_field = "distritos";
    }
    if (scope_field !== '') {
        var level01_itm = $.grep(data[scope_field], function (item, index) {
            return item['cod'] === context.code;
        });
        if (level01_itm !== null && level01_itm.length > 0) {
            var inputcxt = {
                upperTip: scope_name,
                level01_nom: level01_itm[0].nom,
                level01_cod: level01_itm[0].cod,
                list: mpios
            };
            if (context.scope !== 'depto') {
                delete inputcxt.level01_cod;
            }
            dvp.ctx.root01 = scope_field + '/' + context.code;
            dvp.ctx.root02 = 'none';
            if (hash === 'mpios') {
                inputcxt['treeline'] = scope_field + ',' + context.scope;
                $('body').html(this.templates.level02(inputcxt));
                dvp.ctx.level='04';
                $('li.item-li').addClass('mpios-li').each(function (index) {
                    var odd = index % 2 === 0;
                    $(this).addClass(odd ? 'mpios-odd-li' : 'mpios-even-li');
                });
                $('body').on(dvp.toggleClickEvent(), 'li.mpios-li a.itm-nom', function (e) {
                    e.preventDefault();
                    var code = $(this).attr('data-itm-cod') || 'nah';
                    context.mpio = code;
                    dvp.changeView('cpobs', context);
                });
            } else if (hash === 'cpobs') {
                var level02_itm = $.grep(data['municipios'], function (item, index) {
                    return item['cod'] === context.mpio;
                });
                if (level02_itm !== null && level02_itm.length > 0) {
                    inputcxt['level02_nom'] = level02_itm[0].nom;
                    inputcxt['level02_cod'] = level02_itm[0].cod;
                    inputcxt['list'] = cpoblds;
                    inputcxt['treeline'] = scope_field + ',' + context.scope + ',mpio';
                    dvp.ctx.root02 = '' + level02_itm[0].cod;
                    $('body').html(this.templates.level03(inputcxt));
                    dvp.ctx.level='05';
                }
                $('li.item-li').addClass('cpobs-li').each(function (index) {
                    var odd = index % 2 === 0;
                    $(this).addClass(odd ? 'cpobs-odd-li' : 'cpobs-even-li');
                });
            }
        }
    }
};
dvp.prepareAboutListingView = function () {
    var context = {
        upperTip: "Datos de interes",
        aboutHeader: "Sobre DIVIPOLA",
        dvpWhois: "¿Qué es la DIVIPOLA?",
        dvpHistory: "Reseña histórica",
        dvpCronolg: "Histórico DIVIPOLA",
        dvpGlossary: "Glosario"
    };
    $('body').html(this.templates.aboutlist(context));
    $('body').on(dvp.toggleClickEvent(), 'li.about-menu-item a', function (e) {
        e.preventDefault();
        var code = $(this).attr('data-about-link') || 'nah';
        if (code === 'leafs') {
            $('li.about-menu-item-leaf').toggle();
        } else if (code === 'dvpWhois') {
            dvp.prepareAboutWhoisView();
        } else if (code === 'dvpHistory') {
            dvp.prepareAboutHistoryView();
        } else if (code === 'dvpCronolg') {
            dvp.prepareAboutEvolutionView();
        } else if (code === 'dvpGlossary') {
            dvp.prepareAboutGlossaryView();
        }
        if (dvp.iscroll !== null) {
            dvp.iscroll.destroy();
            dvp.iscroll = null;
        }
        dvp.iscroll = new iScroll("wrapper");
    });
};
dvp.prepareContactInfoView = function () {
    var context = {
        upperTip: "Contáctenos",
        nombre: "Departamento Administrativo Nacional de Estadística - DANE",
        direccion: "Carrera 59 No.26-70 Interior I - CAN",
        telefonos: "Conmutador (571) 5978300 - Fax (571) 5978399",
        atencion: "Lunes a Viernes de 08:00 am a 05:00 pm",
        email: "contacto@dane.gov.co",
        tip01: "Para nosotros es importante conocer sus comentarios y sugerencias.",
        tip02: "Cualquier comentario o inquietud en la información de la Codificación de la  División político-administrativa favor enviarla al DANE - Dirección de Geoestadística.",
        contactName: "Ingeniera Olga Marina López Salinas.",
        contactPhone: "(571) 5978340",
        contactEmail: "omlopezs@dane.gov.co"
    };
    $('body').html(this.templates.contact(context));
};
dvp.prepareInformationForXlsSaving = function () {
    var codes = [];
    $('li.item-li a.itm-nom').each(function (index) {
        var cod = $(this).attr('data-itm-cod') || 'nah';
        if (cod !== 'nah') {
            codes.push(cod);
        }
    });
    if (codes.length > 0) {
        dvp.ctx.items = codes.join(';');
        console.log('dvp context',{cts:dvp.ctx});
        if (dvp.isOffline() === true) {
            dvp.showAlert('No hay conexión a internet.', 'Guardar XLS');
        } else {
            dvp.showAlert('Códigos preparados para descarga.', 'Guardar XLS');
        }
    }
};
dvp.prepareAboutWhoisView = function () {
    var context = {
        upperTip: "¿Que es la DIVIPOLA?",
        firstParagraph: "La División Político-administrativa de Colombia DIVIPOLA es un estándar de codificación que permite contar con un listado organizado y actualizado de la totalidad de unidades en que está dividido el territorio nacional, dándole a cada departamento,  municipio, territorio especial biodiverso y fronterizo y  centro poblado, el máximo de estabilidad en su identificación.",
        secondParagraph: "Esta codificación, acorde con la dinámica territorial del país, es actualizada periódicamente por el Departamento Administrativo Nacional de Estadística (DANE), de acuerdo con la información suministrada por las administraciones municipales y departamentales, constituyéndose en fuente de consulta sobre la organización administrativa y política del país."
    };
    $('body').html(this.templates.whois(context));
};
dvp.prepareAboutHistoryView = function () {
    $('body').html(dvp.templates.texts(dvpHistoryContext));
};
dvp.prepareAboutEvolutionView = function () {
    $('body').html(dvp.templates.evolution(dvpEvolutionContext));
    $('body').on(dvp.toggleClickEvent(), 'a.evolution-link', function (e) {
        e.preventDefault();
        var attrLink = $(this).attr('href') || 'none';
        if (attrLink !== 'none') {
            window.open(attrLink, '_system');
        }
    });
};
dvp.prepareAboutGlossaryView = function () {
    $('body').html(dvp.templates.texts(dvpGlossaryContext));
};
dvp.prepareMappingView = function (btn) {
    if (dvp.isOffline() === true) {
        dvp.showAlert('No hay conexión a internet.', 'Cargar mapa');
    } else {
        var cod = btn.attr('data-itm-cod') || 'nah';
        var tree = $('span.data-treeline').html() || 'nah';
        var itm = [];
        if (cod !== 'nah') {
            var treelevel = tree.split(',');
            if (treelevel.length === 1) {
                itm[0] = $.grep(data[treelevel[0]], function (item, index) {
                    return item['cod'] === cod;
                })[0];
            } else if (treelevel.length === 2) {
                var mpio_itm = $.grep(data.municipios, function (item, index) {
                    return item['cod'] === cod;
                });
                if (mpio_itm !== null && mpio_itm.length > 0) {
                    itm[1] = mpio_itm[0];
                    var rootCode = mpio_itm[0][treelevel[1]];
                    itm[0] = $.grep(data[treelevel[0]], function (item, index) {
                        return item['cod'] === rootCode;
                    })[0];
                }
            } else if (treelevel.length === 3) {
                var cpob_itm = $.grep(data.cpoblados, function (item, index) {
                    return item['cod'] === cod;
                });
                if (cpob_itm !== null && cpob_itm.length > 0) {
                    itm[2] = cpob_itm[0];
                    var mpioCode = cpob_itm[0][treelevel[2]];
                    var mpio_itm = $.grep(data.municipios, function (item, index) {
                        return item['cod'] === mpioCode;
                    });
                    if (mpio_itm !== null && mpio_itm.length > 0) {
                        itm[1] = mpio_itm[0];
                        var rootCode = mpio_itm[0][treelevel[1]];
                        itm[0] = $.grep(data[treelevel[0]], function (item, index) {
                            return item['cod'] === rootCode;
                        })[0];
                    }
                }
            }
            var mapContext = {};
            if(treelevel[0] === 'departamentos'){
                mapContext['level01_depto'] = true;
            }
            if (itm[0]['cod']) {
                mapContext['level01_cod'] = itm[0]['cod'];
                mapContext['map_code'] = itm[0]['cod'];
            }
            mapContext['level01_nom'] = itm[0]['nom'];
            if (itm[1]) {
                mapContext['level02_cod'] = itm[1]['cod'];
                mapContext['level02_nom'] = itm[1]['nom'];
                mapContext['map_code'] = itm[1]['cod'];
            }
            if (itm[2]) {
                mapContext['level03_cod'] = itm[2]['cod'];
                mapContext['level03_nom'] = itm[2]['nom'];
                mapContext['map_code'] = itm[2]['cod'];
            }
            $('body').html(dvp.templates.mapping(mapContext));
            dvp.prepareMap(mapContext);
        }
    }
};
dvp.prepareMap = function (mapContext) {
    if (mapContext) {
        var mapConfig = $.grep(mapdata, function (item, index) {
            return item['cod'] === mapContext['map_code'];
        })[0];
        if (mapConfig !== undefined) {
            var mapOptions = {
                center: new google.maps.LatLng(mapConfig['centerLatitude'], mapConfig['centerLongitude']),
                zoom: 8,
                disableDoubleClickZoom: false,
                zoomControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var availabilityErrorMessage = dvp.checkGoogleMapsAvailability();

            if (availabilityErrorMessage != "") {
                dvp.showAlert(availabilityErrorMessage, 'Cargar mapa');
                return;
            }

            var map = new google.maps.Map(document.getElementById("map-canvas"),
                mapOptions);

            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(mapConfig['centerLatitude'], mapConfig['centerLongitude'])
            });

            var bounds = new google.maps.LatLngBounds();
            bounds.extend(new google.maps.LatLng(mapConfig['swLatitude'], mapConfig['swLongitude']));
            bounds.extend(new google.maps.LatLng(mapConfig['neLatitude'], mapConfig['neLongitude']));
            map.fitBounds(bounds);
            
            var mapsEngineLayer = new google.maps.visualization.MapsEngineLayer({
                mapId: '03774390725342724344-05899590172284233324-4',
                layerKey: 'layer_00001',
                map: map,
                clickable: false,
                suppressInfoWindows: true
            });
        } else {
            dvp.showAlert('No hay datos para mostrar en el mapa.', 'Cargar mapa');
        }
    }
};