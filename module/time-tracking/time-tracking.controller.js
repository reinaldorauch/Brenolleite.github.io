(function () {
  'use strict';

  angular
    .module('TimeTracking')
    .controller('TimeTrackingController', TimeTrackingController);

  TimeTrackingController.$inject = ['$scope', '$interval', '$window', '$timeout', '$cookies'];

  function TimeTrackingController($scope, $interval, $window, $timeout, $cookies) {
    var vm = this;

    var timerInterval;
    var selectedTimer = -1;
    var editing = false;

    vm.timers = [];
    vm.newTimer = newTimer;
    vm.editDescription = editDescription;
    vm.selectTimer = selectTimer;
    vm.leaveEdition = leaveEdition;
    vm.enterAsTab = enterAsTab;
    vm.editTimer = editTimer;
    vm.displayTime = displayTime;

    init();

    ////////////////////
    // Implementation //
    ////////////////////

    function init() {
      bindEvents();
    }

    function bindEvents() {
      $scope.$on('$destroy', function() {
        pause();
      });
    }

    function start() {
      if (!timerInterval) {
        timerInterval = $interval(ticking, 1000);
      }
    }

    function pause() {
      if (timerInterval) {
        $interval.cancel(timerInterval);
        timerInterval = undefined;
      }

      selectedTimer = -1;
    }

    function newTimerReg() {
      return {
        time: 0,
        description: '',
        editDesc: false,
        editTimer: false,
        editedTime: undefined
      };
    }

    function newTimer () {
      var newTimerObj = newTimerReg();
      vm.timers.push(newTimerObj);
      selectedTimer = newTimerObj;

      if (!timerInterval) {
        start();
      }

      vm.editDescription(selectedTimer);
    }

    function selectTimer($index) {
      if (!timerInterval) {
        start();
      }

      if (selectedTimer === vm.timers[$index]) {
        pause();
      } else {
        selectedTimer = vm.timers[$index];
      }
    }

    function focusOnField(selector) {
      angular.element(selector).focus();
    }

    function editDescription($index){
      editing = true;

      vm.timers[$index].editDesc = true;

      focusOnField('desc' + $index);
    }

    function editTimer($index) {
       vm.timers[index].editedTime = vm.displayTime(vm.timers[index].time);
      editing = true;
      vm.timers[index].editTimer = true;
      focusOnField('timer' + $index);
    }

    function alertInvalidTime() {
      var opts = {
        title: "Tempo incorreto!",
        text: "O tempo não foi atualizado, tente novamente!"
      };

      return swalFactory.alert(opts);
    }

    function confirmUpdateTimer() {
      var opts = {
        title: 'Tem certeza que deseja alterar o contador para ' + time[0] + ':' + time[1] + ':' + time[2] +  '? ',
        text: 'Essa operação não poderá ser revertida'
      };

      return swalFactory.confirm(opts);
    }

    function saveTimer($index) {
      editing = false;
      vm.timers[$index].editTimer = false;

      if (vm.timers[$index].editedTime) {
        time = vm.timers[$index].editedTime.match(/.{1,2}/g);

        if(parseInt(time[1]) >= 60 || parseInt(time[2]) >= 60){
          return alertInvalidTime();
        }

        return confirmUpdateTimer()
          .then(function (confirmed) {
            if (confirmed) {
              vm.timers[$index].time = parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
            }
          });
      }
    }

    function leaveEdition(index) {
      editing = false;
      $scope.timers[index].editDesc = false;
      $scope.timers[index].editTimer = false;
    }

    function enterAsTab(event, index) {
      if(event.keyCode == 13 && editing) {
        if(vm.timers[index].editTimer) {
          saveTimer(index);
        }

        vm.leaveEdition(index);
      }
    }

    $scope.deleteTimer = function(index){
      swal({
        title: "Deseja excluir contador?",
        text: "Não será possível reverter essa operação!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim!",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true},
           function(){
             if(index == selectedTimer){
               $scope.pause();
               selectedTimer -= 1;
             }

             $scope.timers.splice(index, 1);
             $scope.$digest();
           });
    }

    $scope.keyPress = function(event) {
      if(editing)
        return;
      if((event.keyCode == 87 && event.shiftKey) || event.keyCode == 110)
        $scope.newTimer();
      else if(event.keyCode == 112 && timer != undefined){
        $scope.pause();
        $scope.$digest();
      }
      else if(event.keyCode == 100 && selectedTimer != -1)
        $scope.deleteTimer(selectedTimer);
    }

    function displayTime(time) {
      return moment(time).format('HH:mm:ss DD/MM/YYY');
    }

    $scope.clearList = function() {
      swal({
        title: "Deseja limpar toda a lista?",
        text: "Não será possível reverter essa operação!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true
      },
     function(){
       $scope.pause();
       selectedTimer -= 1;
       $scope.timers = [];
       $scope.$digest();
     });
    }

    function checkDescanso(date) {
      return date.
    }

    function warnDescanso() {
      swal({
        title: "Horário de descanso!",
        text: "O seu contador foi parado automaticamente!",
        type: "warning"
      });
    }

    function ticking() {
      var date = moment();
      if (checkDescanso(date)) {
        pause();
        warnDescanso();
        return;
      }

      $scope.timers[selectedTimer].time += 1;
    }

    function defineClass(type, index){
      if(type == 'i'){
        if(index == selectedTimer)
          return 'fa fa-clock-o fa-pulse icon-green';

        return 'fa fa-clock-o';
      }
      else if(type == 'tr'){
        if(index == selectedTimer)
          return 'active-row';

        return '';
      }
    }


    $window.onbeforeunload = function() {
      $cookies.remove('Timer');

      if($scope.timers.length > 0)
        backUp();

      return null;
    }

    var backUp = function(){
      $cookies.put('Timer', JSON.stringify($scope.timers, function(key, value){
        if(key === "$$hashKey")
          return undefined;

        return value;
      }));
    }

    cookieTimer = $cookies.get('Timer');
    if(cookieTimer != undefined){
      $scope.timers = JSON.parse(cookieTimer);
    }
  }

})();