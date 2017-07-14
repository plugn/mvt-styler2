
<template>
	<li class="col12 clearfix contain dark">
		<div class="animate false  draggable layer-group" draggable="true"><a
				class="pin-topleft z1 icon caret-down pad00y"></a>
			<div title="Group"
				 class="keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro"><span
					class="pin-topleft z1 icon inline folder" style="left: 12px; top: 2px;"></span>
				<div class="pad0x micro" style="padding-left: 27px;">
					<div class="contain col12 ">
						<div class="truncate layer-folder-title"><span data-test="">Group: {{groupLabel}}</span><span
								class="quiet space-left0">3 layers</span>
							<button class="pin-topright animate icon"></button>
						</div>
					</div>
				</div>
				<span class="pin-topright z1 drag-handle animate"></span>
			</div>
		</div>
		<ul>
			<div class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark fill-dark2  "
				 draggable="true" style="padding-left: 10px;" data-nogroup="FAKE_ITEM">
				<div class="space-top0 space-bottom0 pin-left noevents"
					 style="margin-left: 10px; width: 2px; background: rgba(255, 68, 85, 0.75);"></div>
				<button title="country_label" data-test="layer_item-country_label" class="a col12 layer-title animate pad00y pad00x block quiet truncate micro"><span class="transform-uppercase icon inline"></span>
					{{itemLabel}}
				</button>
				<div class="pin-right drag-handle animate"></div>
			</div>



			<div class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark fill-dark2  "
				 draggable="true" style="padding-left: 20px;">
				<div class="space-top0 space-bottom0 pin-left noevents"
					 style="margin-left: 20px; width: 2px; background: rgba(255, 153, 119, 0.75);"></div>
				<button title="admin_country" data-test="layer_item-admin_country"
						class="a col12 layer-title animate pad00y pad00x block quiet truncate micro"><span
						class="line icon inline"></span><!-- react-text: 301 -->admin_country
					<!-- /react-text --></button>
				<div class="pin-right drag-handle animate"></div>
			</div>
			<div class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark fill-dark2  "
				 draggable="true" style="padding-left: 20px;">
				<div class="space-top0 space-bottom0 pin-left noevents"
					 style="margin-left: 20px; width: 2px; background: rgba(255, 204, 68, 0.75);"></div>
				<button title="bridge_major" data-test="layer_item-bridge_major"
						class="a col12 layer-title animate pad00y pad00x block quiet truncate micro"><span
						class="line icon inline"></span><!-- react-text: 307 -->bridge_major<!-- /react-text -->
				</button>
				<div class="pin-right drag-handle animate"></div>
			</div>
			<div class="keyline-bottom keyline-dark2 col12 draggable clearfix animate contain dark fill-dark  "
				 draggable="true" style="padding-left: 20px;">
				<div class="space-top0 space-bottom0 pin-left noevents"
					 style="margin-left: 20px; width: 2px; background: rgba(255, 204, 68, 0.75);"></div>
				<button title="road_major" data-test="layer_item-road_major"
						class="a col12 layer-title animate pad00y pad00x block quiet truncate micro"><span
						class="line icon inline"></span><!-- react-text: 313 -->road_major<!-- /react-text -->
				</button>
				<div class="pin-right drag-handle animate"></div>
			</div>
		</ul>
	</li>

</template>

<script>
export default {
	name: 'ListGroup',
	props: {
		model: [Object],
		itemIndex: [Number]
	}
}
</script>
