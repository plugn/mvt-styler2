<template>
	<div class="animate fill-dark  draggable layer-group" draggable="true"><a
			class="pin-topleft z1 icon caret-down pad00y"></a>



		<div title="Marine labels" class="keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro">
			<span class="pin-topleft z1 icon inline folder" style="left: 12px; top: 2px;"></span>
			<div class="pad0x micro" style="padding-left: 27px; padding-right: 20px;">

				<div class="contain col12 ">
					<form class="">
						<button data-test="" class="pin-right icon check space-right0"></button>
						<input type="text" value="Marine labels"
							   class="truncate space-right1 micro col12 round shortest clean "
							   style="padding-right: 20px;">
					</form>
				</div>
			</div>



			<span class="pin-topright z1 drag-handle animate"></span>
		</div>
	</div>
</template>



<div v-if="editMode" class="contain col12">
	<form v-on:submit.prevent="">
		<button class="pin-right icon check space-right0"></button>
		<input type="text" :value="' type in '"
			   @keyup.27="editMode=false"
			   @keyup.enter="saveId($event.target.value)"
			   class="truncate space-right1 micro col12 round shortest clean pad2r ">
	</form>
</div>



<!-- ============== -->

<div v-if="editMode" class="contain col12">
	<form v-on:submit.prevent="">
		<button class="a pad0y pin-right icon check space-right0"></button>
		<input type="text" :value="codeTitle"
			   @keyup.27="editMode=false"
			   @keyup.enter="saveId($event.target.value)"
			   class="truncate clean small short col12 space-right2 round "
			   style="padding-right: 20px;"
		>
	</form>
</div>

<!-- ============== -->





<template>
	<div class="animate fill-dark  draggable layer-group" draggable="true"><a
			class="pin-topleft z1 icon caret-down pad00y"></a>



		<div title="Marine labels" class="keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro">
			<span class="pin-topleft z1 icon inline folder" style="left: 12px; top: 2px;"></span>
			<div class="pad0x micro" style="padding-left: 27px;">


				<div class="contain col12 ">
					<div class="truncate layer-folder-title"><span data-test="">Marine labels</span><span
							class="quiet space-left0">1 layer</span>
						<button class="pin-topright animate icon"></button>
					</div>
				</div>


			</div>



			<span class="pin-topright z1 drag-handle animate"></span>
		</div>
	</div>
</template>






















<template>
	<div title="Marine labels" class="keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro"><span
			class="pin-topleft z1 icon inline folder" style="left: 12px; top: 2px;"></span>
		<div class="pad0x micro" style="padding-left: 27px;">
			<div class="contain col12 ">
				<form class="">
					<button data-test="" class="pin-right icon check space-right0"></button>
					<input type="text" value="Marine labels"
						   class="truncate space-right1 micro col12 round shortest clean " style="padding-right: 20px;">
				</form>
			</div>
		</div>
		<span class="pin-topright z1 drag-handle animate"></span></div>
</template>


<template>
	<div class="animate fill-dark  draggable layer-group" draggable="true"><a
			class="pin-topleft z1 icon caret-down pad00y"></a>
		<div title="Marine labels" class="keyline-bottom keyline-dark2 layer-folder block pad0x pad00y pointer micro">
			<span class="pin-topleft z1 icon inline folder" style="left: 12px; top: 2px;"></span>
			<div class="pad0x micro" style="padding-left: 27px;">
				<div class="contain col12 ">
					<form class="">
						<button data-test="" class="pin-right icon check space-right0"></button>
						<input type="text" value="Marine labels"
							   class="truncate space-right1 micro col12 round shortest clean "
							   style="padding-right: 20px;"></form>
				</div>
			</div>
			<span class="pin-topright z1 drag-handle animate"></span></div>
	</div>
</template>