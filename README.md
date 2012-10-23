# readablets

jQuery plugin that turns timestamps into human readable (relatively) format and updates automatically. Timestamps should be in miliseconds (i.e. if you use Unix's just multiply the result by 1000).

# usage

Shows time at creation of this element:
	
	$('<span\/>')
		.appendTo('body')
		.text((new Date).getTime())
		.readablets();


# demo
For detailed docs and demo:

http://aquaron.com/jquery/readablets
