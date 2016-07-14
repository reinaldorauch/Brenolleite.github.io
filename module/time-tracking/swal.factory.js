(function () {
  'use strict';

  angular
    .module('TimeTracking')
    .factory('swalFatory', swalFactory);

  swalFactory.$inject = ['$q'];

  function swalFactory($q) {
    var alertDefaults = {
      title: 'Alerta!',
      text: 'Algo de errado não está certo!',
      type: 'warning'
      confirmButtonText: 'OK',
      closeOnConfirm: true
    };

    var confirmDefaults = {
      title: 'Tem certeza?',
      text: '',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Sim!",
      cancelButtonText: "Cancelar",
      closeOnConfirm: true
    };

    var service = {
      alert: alert,
      confirm: confirm
    };

    return service;

    ////////////////////
    // Implementation //
    ////////////////////

    // Public

    function alert(options) {
      return openSwal(alertDefaults, options);
    }

    function confirm(options) {
      return openSwal(confirmDefaults, options);
    }

    // Private

    function openSwal(defaults, options) {
      var def = $q.defer();
      swal(Object.assign(defaults, options), def.resolve);
      return $q.promise;
    }
  }
})