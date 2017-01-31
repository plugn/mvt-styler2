<template>
	<ul id="multi" class="tile__root" style="margin: 50px 20px;">
		<li v-for="listItem in listData">{{ listItem.name }}</li>

		<li class="">group0 item2</li>

		<li class="tile tile__folder">
			<span class="tile__name">[ Group A ]</span>
			<ul class="tile__list">
				<li class="hidden"> </li>
				<li>groupA item1</li>
				<li>groupA item2</li>
				<li>groupA item3</li>
			</ul>
		</li>

		<li class="tile tile__folder">
			<span class="tile__name">[ Group B ]</span>
			<ul class="tile__list">
				<li class="hidden"> </li>
				<li>group B item1</li>
				<li>group B item2</li>
				<li>group B item3</li>
			</ul>
		</li>

		<li class="tile tile__folder">
			<span class="tile__name">[ Group C ]</span>
			<ul class="tile__list">
				<li class="hidden"> </li>
				<li>group C item1</li>
				<li>group C item2</li>
			</ul>
		</li>

	</ul>
</template>

<style src="./LayerList.css" scoped></style>

<script src="./LayerList.js"></script>
