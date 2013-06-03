var dvp = {
    templates: {},
    iscroll: null
};
dvp.initialize = function () {
    this.templates.home = Handlebars.compile($("#hbt-home").html());
    this.templates.level01 = Handlebars.compile($("#hbt-level01").html());
    this.templates.level02 = Handlebars.compile($("#hbt-level02").html());
    this.templates.level03 = Handlebars.compile($("#hbt-level03").html());
    this.templates.contact = Handlebars.compile($("#hbt-contact").html());
}
dvp.prepareMainView = function () {
    var searchMenu = [
        {
            label: 'Departamentos',
            hash: 'deptos'
        }, {
            label: 'Áreas Metropolitanas',
            hash: 'amtrps'
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

    $('body').off('click').on('click', 'li.home-menu-item', function (e) {
        e.preventDefault();
        var hash = $(this).attr('data-home-link') || 'nah';
        dvp.changeView(hash);
    });
};
dvp.changeView = function (hash, context) {
    if (hash === 'deptos') {
        dvp.prepareDeptosMainView();
    } else if (hash === 'amtrps') {
        dvp.prepareAreasMetropsMainView();
    } else if (hash === 'dstrts') {
        dvp.prepareDistrtsMainView();
    } else if (hash === 'mpios' || hash === 'cpobs') {
        dvp.prepareInnerGeographiesMainView(hash, context);
    } else if (hash === 'contact') {
        dvp.prepareContactInfoView();
    }

    if (dvp.iscroll !== null) {
        dvp.iscroll.destroy();
        dvp.iscroll = null;
    }
    dvp.iscroll = new iScroll("wrapper");
    $('body').off('click', 'img.back-home-icon').on('click', 'img.back-home-icon', function (e) {
        e.preventDefault();
        dvp.prepareMainView();
    });
    $('body').off('click', 'img.vmap-icon').on('click', 'img.vmap-icon', function (e) {
        e.preventDefault();
        alert('voy pal mapa');
    });
}
dvp.prepareDeptosMainView = function () {
    $('body').html(this.templates.level01({
        upperTip: "Códigos por departamento",
        tip_bog: "Nota: No se debe tener en cuenta a Bogotá D.C. como departamento.",
        list: data.departamentos
    }));
    $('li.item-li').addClass('deptos-li');
    $('body').off('click').on('click', 'li.deptos-li a.itm-nom', function (e) {
        e.preventDefault();
        var code = $(this).attr('data-itm-cod') || 'nah';
        dvp.changeView('mpios', {
            scope: 'depto',
            code: code
        });
    });
}
dvp.prepareAreasMetropsMainView = function () {
    $('body').html(this.templates.level01({
        upperTip: "Códigos por área metropolitana",
        list: data.areasmetrop
    }));
    $('li.item-li').addClass('amtrps-li');
    $('body').off('click').on('click', 'li.amtrps-li a.itm-nom', function (e) {
        e.preventDefault();
        var code = $(this).attr('data-itm-cod') || 'nah';
        dvp.changeView('mpios', {
            scope: 'armtrp',
            code: code
        });
    });
}
dvp.prepareDistrtsMainView = function () {
    $('body').html(this.templates.level01({
        upperTip: "Códigos por distritos",
        list: data.distritos
    }));
    $('li.item-li').addClass('dstrts-li');
    $('body').off('click').on('click', 'li.dstrts-li a.itm-nom', function (e) {
        e.preventDefault();
        var code = $(this).attr('data-itm-cod') || 'nah';
        dvp.changeView('mpios', {
            scope: 'dstrt',
            code: code
        });
    });
}
dvp.prepareInnerGeographiesMainView = function (hash, context) {
    var mpios = null;
    var cpoblds = null;
    if (hash === 'mpios') {
        mpios = $.grep(data.municipios, function (item, index) {
            return item[context.scope] === context.code;
        });
    } else if (hash === 'cpobs') {
        cpoblds = $.grep(data.cpoblados, function (item, index) {
            return item['mpio'] === context.mpio;
        });
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
            if (hash === 'mpios') {
                $('body').html(this.templates.level02(inputcxt));
                $('li.item-li').addClass('mpios-li').each(function (index) {
                    var odd = index % 2 == 0;
                    $(this).addClass(odd ? 'mpios-odd-li' : 'mpios-even-li');
                });
                $('body').off('click').on('click', 'li.mpios-li a.itm-nom', function (e) {
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
                    $('body').html(this.templates.level03(inputcxt));
                }
                $('li.item-li').addClass('cpobs-li').each(function (index) {
                    var odd = index % 2 == 0;
                    $(this).addClass(odd ? 'cpobs-odd-li' : 'cpobs-even-li');
                });
                $('body').off('click');
            }
        }
    }
}
dvp.prepareContactInfoView = function () {
    var context = {
        upperTip: "Contáctenos",
        nombre: "Departamento Administrativo Nacional de Estadística - DANE",
        direccion: "Carrera 59 No.26-70 Interior I - CAN",
        telefonos: "Conmutador (571) 5978300 - Fax (571) 5978399",
        atencion: "Lunes a Viernes de 08:00 am a 05:00 pm",
        email: "contacto@dane.gov.co"
    };
    $('body').html(this.templates.contact(context));
    $('body').off('click');
}