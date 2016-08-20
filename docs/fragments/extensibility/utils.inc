<div class="panel panel-default">
	<div class="panel-heading">luga.router.utils API Syntax reference</div>
	<div class="panel-body">
		<p>
			luga.router.utils exposes static API that can be used to write your own routeHandler implementation.
			These are heavily based on <a href="https://millermedeiros.github.io/crossroads.js/">Crossroads.js</a>
		</p>
	</div>
</div>

<div class="panel panel-default">
	<div class="panel-heading luga-docs-api-heading">luga.router.utils.compilePath(path)</div>
	<div class="panel-body">
		Generates a RegExp able to match the given path
	</div>
	<table class="table table-bordered luga-docs-api">
		<th colspan="3">Arguments</th>
		<tr>
			<td>path</td>
			<td>
				{string}
			</td>
			<td>
				A path/pattern to be converted into a RegExp. Required
			</td>
		</tr>
	</table>
	<table class="table table-bordered luga-docs-api">
		<th>Return type</th>
		<tr>
			<td>{RegExp}</td>
		</tr>
	</table>
	<table class="table table-bordered luga-docs-api">
		<th>Examples</th>
	</table>

<pre><code class="language-javascript">luga.router.utils.compilePath("literal"); // => /^\/?literal\/?$/
luga.router.utils.compilePath("literal"); // => /^\/?literal\/?$/
luga.router.utils.compilePath("literal/{first}/{second}"); // => /^\/?literal\/([^\/?]+)\/([^\/?]+)\/?$/
luga.router.utils.compilePath("{first}/:firstoption:"); // => /^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?$/
luga.router.utils.compilePath("literal/{first*}"); // => /^\/?literal\/(.+)\/?$/
</code></pre>

</div>