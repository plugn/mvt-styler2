export default {
	name: 'My Tree',
	children: [
		{ name: 'hello' },
		{ name: 'wat' },
		{
			name: 'child folder',
			children: [
				{
					name: 'subfolder',
					children: [
						{ name: 'sub hello' },
						{ name: 'sub wat' }
					]
				},
				{ name: 'hello' },
				{ name: 'wat' },
				{
					name: 'sub2  folder',
					children: [
						{ name: 'sub2 hello' },
						{ name: 'sub2 wat' }
					]
				}
			]
		}
	]
}