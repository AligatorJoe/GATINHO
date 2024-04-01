 (function() {
    let configLinks = {
        senate: {
            label: Senado_icon ,
            fn: () => MainWindowFactory.openMainWindow(),
        },
        cave: {
            label: Gruta_icon ,
            fn: () => HideWindowFactory.openHideWindow(),
        },
        warehouse: {
            label: Armazem_icon ,
            fn: () => BuildingWindowFactory.open('storage'),
        },
        farm: {
            label: Quinta_icon ,
            fn: () => FarmWindowFactory.openFarmWindow(),
        },
        timberCamp: {
            label: Serracao_icon ,
            fn: () => LumberWindowFactory.openLumberWindow(),
        },
        quarry: {
            label: Pedreira_icon ,
            fn: () => StonerWindowFactory.openStonerWindow(),
        },
        silverMine: {
            label: Mina_icon ,
            fn: () => IronerWindowFactory.openIronerWindow(),
        },
        marketPlace: {
            label: Mercado_icon ,
            fn: () => MarketWindowFactory.openMarketWindow(),
        },
        harbor: {
            label: Porto_icon ,
            fn: () => DocksWindowFactory.openDocksWindow(),
        },
        barracks: {
            label: Quartelo_icon ,
            fn: () => BarracksWindowFactory.openBarracksWindow(),
        },
        cityWall: {
            label: Muralha_icon ,
            fn: () => BuildingWindowFactory.open('wall'),
        },
        academy: {
            label: Academie_icon ,
            fn: () => AcademyWindowFactory.openAcademyWindow(),
        },
        temple: {
            label: Templo_icon ,
            fn: () => TempleWindowFactory.openTempleWindow(),
        },
        agoraDefence: {
            label: Agora_icon ,
            fn: () => PlaceWindowFactory.openPlaceWindow('culture',open),
        },
        troopsOutside: {
            label: Exterior_icon ,
            fn: () => PlaceWindowFactory.openPlaceWindow('units_beyond', open),
        },
        simulator: {
            label: Simulator_icon ,
            fn: () => PlaceWindowFactory.openPlaceWindow('simulator', open),
        },
        culture: {
            label: 'Culture',
            fn: () => PlaceWindowFactory.openPlaceWindow('culture'),
        },
    };
    let uiBarConfig = {
        left: [
            configLinks.senate,
            configLinks.academy,
            configLinks.marketPlace,
            configLinks.agoraDefence,
        ],
        right: [
            configLinks.cityWall,
            configLinks.cave,
            configLinks.harbor,
            configLinks.barracks,
        ],
    };
    uiBarConfig.right.reverse();
    let uiBar = $('.ui_quickbar');
    if (!uiBar.length) return;
    if (uiBar.has('*').length) return;
    uiBarConfig.left.forEach(cfg => appendToUiBar(uiBar, 'left', cfg));
    uiBarConfig.right.forEach(cfg => appendToUiBar(uiBar, 'right', cfg));
    function appendToUiBar(uiBar, position, cfg) {
        let link = $('<a href="#"></a>');
        link.html(cfg.label);
        link.css({
            'float': position,
            'margin': '0 1em',
            'color': 'white',
            'line-height': '0.1',
        });
        link.click(cfg.fn);
        uiBar.append(link);
    }
})();