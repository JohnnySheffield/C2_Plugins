// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class

cr.plugins_.nwk = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	
	var pluginProto = cr.plugins_.nwk.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	var theInstance = null;
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
	
		theInstance = this;
		theInstance.windows={};
		try{
			this.IsNodeWebkit = process.versions['node-webkit'];
			this.IsNodeWebkit = true;
			this.gui = require('nw.gui');
			this.win = this.gui.Window.get();
			this.clipboard = this.gui.Clipboard.get();
			this.newWin = {};
	        this.curTag = "";
			this.listen();
			this.arguments = this.gui.App.argv
		}
		catch(e){
			this.IsNodeWebkit= false;
			this.gui = null;
			this.win = null;
			this.clipboard = null;
			this.curTag = null;
			
			return;
			
		}


	};
	
	
	instanceProto.require = function()
	{

		
	
	}
	
	instanceProto.createWindow = function(url_, specs_, tag_)
	{
		var self = this;
		var window_  = null;
		try{
	    var spec = JSON.parse(specs_);
		}
		catch (e)
			{
				console.log(e)
			}
		
	    window_ = this.gui.Window.get(
		     self.gui.Window.open(url_, spec)
		);
		window_.close();
		theInstance.windows[tag_] = window_;
		window_.on('focus', function() {
			console.log('New window is focused: ', tag_);
			
			self.curTag = tag_;
			
			self.runtime.trigger(cr.plugins_.nwk.prototype.cnds.OnFocused, self);


		});
	    
	
	
	}
	
	
	instanceProto.listen = function()
	{

	    var win =  this.win;
		var instance = this;
		var runtime = instance.runtime;
/*
		win.on('enter-fullscreen', 
			function() {
				runtime.trigger(pluginProto.cnds.OnFullscreen,instance);
			
		});
		
		/////////This makes problem, so i commented it out...
		win.on('close', 
			function() {
				runtime.trigger(pluginProto.cnds.OnClose,instance);
				this.win=null;
				console.log('close event; win=null');
			});
		
		win.on('leave-fullscreen', 
			function() {
				runtime.trigger(pluginProto.cnds.OnLeaveFullscreen,instance);
			});
		win.on('loaded', 
			function() {
				runtime.trigger(pluginProto.cnds.OnLoaded,instance);
			});
		win.on('focus', 
			function() {
				runtime.trigger(pluginProto.cnds.OnFocus,instance);
			});
		win.on('minimize', 
			function() {
				runtime.trigger(pluginProto.cnds.OnMinimize,instance);
			});
		win.on('restore', 
			function() {
				runtime.trigger(pluginProto.cnds.OnRestored,instance);
			});
		win.on('blur', 
			function() {
				runtime.trigger(pluginProto.cnds.OnBlur,instance);
			});
	*/
	};

	//////////////////////////////////////
	// Conditions
	/*
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	*/
	function Cnds() {};
	
	Cnds.prototype.OnFullscreen = function()
	{
		return true;
	};
	Cnds.prototype.OnClose = function()
	{
		return true;
	};
	Cnds.prototype.OnLeaveFullscreen = function()
	{
		return true;
	};
	Cnds.prototype.OnLoaded = function()
	{
		return true;
	};
	
	Cnds.prototype.OnFocused = function(tag)
	{
		console.log(tag.toLowerCase() === this.curTag.toLowerCase());
		//return true;
		return tag.toLowerCase() === this.curTag.toLowerCase();
		
	};
	Cnds.prototype.OnMinimize = function()
	{
		return true;
	};
	Cnds.prototype.OnRestored = function()
	{
		return true;
	};
	Cnds.prototype.OnBlur = function()
	{
		return true;
	};
	Cnds.prototype.IsNodeWebkit = function()
	{
		return this.IsNodeWebkit;
	};

	pluginProto.cnds = new Cnds();
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;	
	
	acts.quit = function ()
	{
	    if (!this.IsNodeWebkit)
			return;

		this.gui.App.quit();
	    this.win.hide();
		this.win=null;

	};
	
	

	acts.minimize = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.minimize();
	};
	acts.enterFullscreen = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.enterFullscreen();
	};
	acts.leaveFullscreen = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.leaveFullscreen();
	};
	acts.toggleFullscreen = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.toggleFullscreen();
	};
	acts.restore = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.restore();
	};
	acts.reloadIgnoringCache = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.reloadIgnoringCache();
	};
	acts.focus = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.focus();
	};
	acts.blur = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.blur();
	};
	acts.show = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.show();
	};
	acts.hide = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.hide();
	};
	acts.close = function (bool)
	{
	  	if (!this.IsNodeWebkit)
			return;  
		
		if (bool === 'true'){
			this.win.close(true);
		} else{
			this.win.close();
		}
		
	};
	acts.closeTag = function (tag)
	{
	  	if (!this.IsNodeWebkit)
			return;  
	
		theInstance.windows[tag].close();
		//theInstance.windows[tag] = null;
		
	};
	acts.reload = function (tag)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.reload();
		//this.win=null;
	};
	acts.enterKioskMode = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.enterKioskMode();
	};
	acts.leaveKioskMode = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.leaveKioskMode();
	};
	acts.toggleKioskMode = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.toggleKioskMode();
	};
	acts.showDevTools = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.showDevTools();
	};
	acts.setMaximumSize = function (width, height)
	{	
		if (!this.IsNodeWebkit)
			return;
		
		this.win.setMaximumSize(width, height);
	};
	acts.setMinimumSize = function (width, height)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.setMinimumSize(width, height);
	};
	acts.setResizable = function (BooleanResizable)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		var bool = BooleanResizable;
	    if (bool==true){
			this.win.setResizable(true);
		} else{
			this.win.setResizable(false);
		}
	};
	acts.setAlwaysOnTop = function (BooleanTop)
	{
		if (!this.IsNodeWebkit)
			return;
		
		var bool = BooleanTop;
	    if (bool==true){
			this.win.setAlwaysOnTop(true);
		} else{
			this.win.setAlwaysOnTop(false);
		}
	};
	acts.setWidth = function (width)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.width(width);
	};
	acts.setHeight = function (height)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.height(height);
	};
	acts.closeAllWindows = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.closeAllWindows();
	};
	acts.title = function (title)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.title(title);
	};
	acts.X = function (X)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.x(X);
	};
	acts.Y = function (Y)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.y(Y);
	};
	acts.moveBy = function (x,y)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.moveBy(x,y);
	};
	acts.resizeTo = function (width, height)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.win.resizeTo(width, height);
	};
	acts.resizeBy = function (width, height)
	{
		if (!this.IsNodeWebkit)
			return;
			
		this.win.resizeBy(width, height);
	};
	acts.ClipboardSet = function (string)
	{
		if (!this.IsNodeWebkit)
			return;
			
		this.clipboard.set(string, 'text');
	};
	acts.ClipboardClear = function ()
	{
		if (!this.IsNodeWebkit)
			return;
			
		this.clipboard.clear();
	};
	acts.openExternal = function (URI)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.gui.openExternal(URI);
	};
	acts.openItem = function (file_path)
	{
		if (!this.IsNodeWebkit)
			return;
		
		this.gui.openItem(file_path);
	};
	acts.showItemInFolder = function (file_path)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.gui.showItemInFolder(file_path);
	};
	acts.open = function (url_, specs_, tag_)
	{
		if (!this.IsNodeWebkit)
			return;	
		
		//window.open(url, '_blank', specs);
		//this.newWin[tag] = this.gui.Window.open(url, specs);
		this.createWindow(url_, specs_, tag_);
		
		
	};
	acts.closeAllWindows = function ()
	{
		if (!this.IsNodeWebkit)
			return;	
		
		this.gui.App.closeAllWindows();
	};
	



	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	exps.windowWidth = function (ret)	
	{
		!this.IsNodeWebkit ? "" : ret.set_int(this.win.width);
	};
	exps.windowHeight = function (ret)	
	{
		!this.IsNodeWebkit ? "" : ret.set_int(this.win.height);
	};
	exps.windowX = function (ret)	
	{
		!this.IsNodeWebkit ? "" : ret.set_int(this.win.x);
	};
	exps.windowY = function (ret)	
	{
		!this.IsNodeWebkit ? "" : ret.set_int(this.win.y);
	};
	exps.Clipboard = function (ret)	
	{
		!this.IsNodeWebkit ? "" : ret.set_string(this.clipboard.get('text'));
	};
	exps.Version = function (ret)	
	{
		!this.IsNodeWebkit ? "" : ret.set_string(process.versions['node-webkit']);
	};
	exps.clArguments = function (ret, index)	
	{
		if(this.IsNodeWebkit){ 
			var element = "";
			if (index < this.arguments.length)
				{
					element = this.arguments[index];
				}
			ret.set_string(element);
		} else {
		   	ret.set_string("");
		}
	};
	exps.clArgumentsLength = function (ret, index)	
	{
		!this.IsNodeWebkit ? "" : ret.set_int(this.arguments.length);	
	};

	
	

}());