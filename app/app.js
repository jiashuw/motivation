(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dob) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var val = localStorage.dob;
  if (val != 'null'){
    this.dob = new Date(parseInt(val));
  }
};

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
  if(this.textColor)
    localStorage.textColor = this.textColor;
  if(this.backgroundColor)
    localStorage.backgroundColor = this.backgroundColor;
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.backgroundColor = $('backgroundPicker').value;
  this.textColor = $('textPicker').value;
  this.save();

  document.body.style.backgroundColor = this.backgroundColor;
  document.body.style.color = this.textColor;

  this.renderAgeLoop();
  location.reload();
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 100);
  document.body.style.backgroundColor = localStorage.backgroundColor;
  document.body.style.color = localStorage.textColor;
};

App.fn.renderAge = function(){
  var now            = new Date;
  var currentMonth   = now.getMonth();
  var currentDate     = now.getDate();
  var hasBirthdayHappenedThisCalendarYear = (currentMonth > this.dob.getMonth()) || (currentMonth <= this.dob.getMonth() && currentDate >= this.dob.getDate() + 1);
  var milestoneYear = hasBirthdayHappenedThisCalendarYear ? now.getFullYear() + 1 : now.getFullYear();
  var milestoneDate  = new Date(milestoneYear, this.dob.getMonth(), this.dob.getDate() + 1);
  var duration       = milestoneDate - now ;
  var days           = (duration / 86400000);

  var majorMinor = days.toFixed(6).toString().split('.');

  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year:         majorMinor[0],
      milliseconds: majorMinor[1]
    }));
    document.getElementById('reset').onclick = function(){
      this.dob = null;
      this.textColor = null;
      this.backgroundColor = null;
      localStorage.backgroundColor = null;
      localStorage.textColor = null;
      localStorage.dob = null;
      location.reload();
    };
    document.getElementById('reset').style.opacity = '1';
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'))

})();
