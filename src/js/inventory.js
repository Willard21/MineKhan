import { SLAB, STAIR, shapes } from "./shapes"
import { blockData, blockIds } from "./blockData"

/**
* @type {HTMLCanvasElement}
*/
const invCanvas = document.getElementById("inventory")
const invCtx = invCanvas.getContext("2d")

/**
* @type {HTMLCanvasElement}
*/
const containerCanvas = document.getElementById("container")
const contCtx = containerCanvas.getContext("2d")

const heldItemCanvas = document.createElement("canvas")
heldItemCanvas.style.zIndex = 2
heldItemCanvas.style.pointerEvents = "none"
heldItemCanvas.width = 64
heldItemCanvas.height = 64
heldItemCanvas.className = "hidden corner"
heldItemCanvas.id = "heldItem"
document.body.append(heldItemCanvas)

invCanvas.oncontextmenu = heldItemCanvas.oncontextmenu = containerCanvas.oncontextmenu = function(e) {
	e.preventDefault()
}

const heldCtx = heldItemCanvas.getContext("2d")

/**
 * @type {HTMLDivElement}
 */
const hoverBox = document.getElementById("onhover")

function displayHoverText(text, mouseX, mouseY) {
	hoverBox.textContent = text
	hoverBox.classList.remove("hidden")
	if (mouseY < window.parent.innerHeight / 2) {
		hoverBox.style.bottom = ""
		hoverBox.style.top = mouseY + 10 + "px"
	}
	else {
		hoverBox.style.top = ""
		hoverBox.style.bottom = window.parent.innerHeight - mouseY + 10 + "px"
	}
	if (mouseX < window.parent.innerWidth / 2) {
		hoverBox.style.right = ""
		hoverBox.style.left = mouseX + 10 + "px"
	}
	else {
		hoverBox.style.left = ""
		hoverBox.style.right = window.parent.innerWidth - mouseX + 10 + "px"
	}
}

class InventoryItem {
	/**
	 * @param {Number} id
	 * @param {String} name
	 * @param {Number} stackSize
	 * @param {HTMLCanvasElement} icon
	 */
	constructor(id, name, stackSize, icon) {
		this.id = id
		this.name = name
		this.stackSize = stackSize
		this.icon = icon
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 */
	render(ctx, x, y, width) {
		if (!this.icon) return
		ctx.drawImage(this.icon, x, y, width, width)

		if (this.stackSize > 1) {
			ctx.font = "12px Monospace"
			ctx.textAlign = "right"
			ctx.fillStyle = "white"
			ctx.fillText(this.stackSize.toString(), x + width - 4, y + width - 4)
		}
	}
	copy() {
		return new InventoryItem(this.id, this.name, this.stackSize, this.icon)
	}
}

const air = new InventoryItem(0, "Air", 1, null)

class InventoryPage {
	creative = true
	left = 0
	top = 0
	slotSize = 64
	size = 27
	width = 9 * this.slotSize
	height = Math.ceil(this.size / 9) * this.slotSize
	hoverIndex = -1

	/**
	 * @type {Array<InventoryItem>}
	 */
	items = []

	/**
	 * @param {CanvasRenderingContext2D} context The context to render to.
	 * @param {HTMLCanvasElement} icon The icon for the inventory page. Like a stair block for the stair inventory or whatever.
	 */
	constructor(context, icon) {
		this.icon = icon
		this.ctx = context
	}

	/**
	 * @param {InventoryItem} item
	 */
	addItem(item) {
		if (!item || item === air) return
		for (let i = 0; i < this.size; i++) {
			if (!this.items[i]) {
				this.items[i] = item
				return
			}
			if (this.items[i].id === item.id) {
				this.items[i].stackSize += item.stackSize
				return
			}
		}
	}
	sortByName() {
		this.items.sort((a, b) => a.name.localeCompare(b.name))
	}
	sortById() {
		this.items.sort((a, b) => a.id - b.id)
	}

	indexAt(x, y) {
		if (x < this.left || y < this.top || x > this.left + this.width || y > this.top + this.height) return -1
		x = (x - this.left) / this.slotSize | 0
		y = (y - this.top) / this.slotSize | 0
		if (x < 0 || x > 9 || y < 0 || y * 9 + x >= this.size) return -1
		return y * 9 + x
	}

	renderRow(left, top, slotSize, index) {
		for (let px = 0; px < 9 && index < this.size; px++) {
			if (this.items[index]?.icon) {
				this.items[index].render(this.ctx, left + px * slotSize, top, slotSize)
			}
			index++
		}
	}

	/**
	 * @param {Number} left
	 * @param {Number} top
	 * @param {Number} slotSize
	 */
	render(left = this.left, top = this.top, slotSize = this.slotSize) {
		// Save render data so we'll have it for click detection
		this.left = left
		this.top = top
		this.slotSize = slotSize
		this.width = 9 * slotSize
		this.height = Math.ceil(this.size / 9) * slotSize
		this.ctx.canvas.height = top + this.height + 10 // Clears the canvas like ctx.clearRect
		this.ctx.canvas.width = this.width + left * 2

		// Draw the blocks
		let drawn = 0
		for (let py = 0; drawn < this.size; py++) {
			this.renderRow(left, top + py * slotSize, slotSize, drawn)
			drawn += 9
		}

		// Draw the grid
		this.ctx.lineWidth = 4
		this.ctx.strokeStyle = "black"
		this.ctx.beginPath()
		for (let y = 0; y <= this.height; y += slotSize) {
			this.ctx.moveTo(left,              top + y)
			this.ctx.lineTo(left + this.width, top + y)
		}
		for (let x = 0; x <= this.width; x += slotSize) {
			this.ctx.moveTo(left + x, top)
			this.ctx.lineTo(left + x, top + this.height)
		}
		this.ctx.stroke()
	}
	/**
	 * @param {MouseEvent} event
	 */
	mouseMove(event) {
		const mouseX = event.offsetX
		const mouseY = event.offsetY
		const overIndex = this.indexAt(mouseX, mouseY)
		if (this.items[overIndex]) displayHoverText(this.items[overIndex].name, event.x, event.y)
		if (this.hoverIndex === overIndex) return
		this.ctx.lineWidth = 4

		// Clear the previous highlight
		if (this.hoverIndex >= 0) {
			this.ctx.strokeStyle = "black"
			const x = this.hoverIndex % 9 * this.slotSize + this.left
			const y = (this.hoverIndex / 9 | 0) * this.slotSize + this.top
			this.ctx.strokeRect(x, y, this.slotSize, this.slotSize)
		}
		this.hoverIndex = overIndex

		// Draw new highlight and hover text
		if (overIndex >= 0 && this.items[overIndex]?.icon) {
			this.ctx.strokeStyle = "white"
			const x = overIndex % 9 * this.slotSize + this.left
			const y = (overIndex / 9 | 0) * this.slotSize + this.top
			this.ctx.strokeRect(x, y, this.slotSize, this.slotSize)
		}
		else hoverBox.classList.add("hidden")
	}

	/**
	 * What happens when the inventory is clicked
	 * @param {InventoryItem} heldItem The item being dragged around by the mouse
	 * @returns InvenetoryItem
	 */
	mouseClick(heldItem) {
		if (this.hoverIndex === -1) return null
		if (this.creative) {
			if (heldItem?.id === this.items[this.hoverIndex].id) {
				if (heldItem.stackSize < 64) heldItem.stackSize++
				return heldItem
			}
			return this.items[this.hoverIndex].copy() // Discard the previously held item
		}
		let old = this.items[this.hoverIndex]
		if (!heldItem && !old) return null
		if (old?.id === heldItem?.id) {
			old.stackSize += heldItem.stackSize
			if (old.stackSize > 64) {
				heldItem.stackSize = old.stackSize - 64
				old.stackSize = 64
				old = heldItem
			}
			else old = null
		}
		else this.items[this.hoverIndex] = heldItem || null

		// Redraw the tile
		const x = this.hoverIndex % 9 * this.slotSize + this.left
		const y = (this.hoverIndex / 9 | 0) * this.slotSize + this.top
		this.ctx.clearRect(x, y, this.slotSize, this.slotSize)
		if (this.items[this.hoverIndex]) {
			this.items[this.hoverIndex].render(this.ctx, x, y, this.slotSize)
			this.ctx.strokeStyle = "white"
		}
		else invCtx.strokeStyle = "black"
		invCtx.strokeRect(x, y, this.slotSize, this.slotSize)

		return old
	}

	/**
	 * @param {InventoryItem | Number} item
	 * @param {Number} index
	 */
	setItem(item, index) {
		if (!item) {
			this.items[index] = null
		}
		else if (item instanceof InventoryItem) {
			this.items[index] = item
		}
		else {
			this.items[index] = new InventoryItem(item, blockData[item].name, 1, blockData[item].iconImg)
		}
	}
}

class Hotbar {
	/**
	 * @param {InventoryPage} inventory
	 * @param {Number} start The first index in the inv to use as the hotbar
	 */
	constructor(inventory, start) {
		this.inventory = inventory
		this.start = this.index = start

		/**
		 * @type {HTMLCanvasElement}
		 */
		this.canvas = document.getElementById("hotbar")
		this.ctx = this.canvas.getContext("2d")
	}

	// Make for..of loops loop over the correct elements
	*[Symbol.iterator]() {
		for (let i = this.start; i < this.inventory.size; i++) yield this.inventory.items[i]?.id || 0
	}

	pickBlock(blockID) {
		let empty = -1
		for (let i = this.start; i < this.inventory.size; i++) {
			if (this.inventory.items[i]?.id === blockID) {
				this.select("black")
				this.index = i
				this.select("white")
				return
			}
			else if (!this.inventory.items[i] && empty === -1) empty = i
		}

		if (empty >= 0 && this.hand !== air) {
			this.select("black")
			this.index = empty
		}
		else this.inventory.addItem(this.inventory.items[this.index])
		let itemData = blockData[blockID]
		this.inventory.items[this.index] = new InventoryItem(blockID, itemData.name, 1, itemData.iconImg)
		this.render()
	}

	setPosition(index) {
		this.select("black")
		this.index = this.start + index
		this.select("white")
	}
	shiftPosition(amount) {
		this.select("black")
		this.index += Math.sign(amount)
		if (this.index >= this.inventory.size) this.index -= 9
		if (this.index < this.start) this.index += 9
		this.select("white")
	}

	get hand() {
		return this.inventory.items[this.index] || air
	}

	select(color) {
		this.ctx.lineWidth = 4
		this.ctx.strokeStyle = color

		const width = this.inventory.slotSize
		this.ctx.strokeRect(2 + width * (this.index - this.start), 2, width, width)
	}

	render() {
		const width = this.inventory.slotSize
		this.canvas.width = width * 9 + 4
		this.canvas.height = width + 4
		this.ctx.lineWidth = 4
		this.ctx.strokeStyle = "black"

		for (let i = 0; i < 9; i++) {
			const x = 2 + width * i
			this.inventory.items[this.start + i]?.render(this.ctx, x, 2, width)
			this.ctx.strokeRect(x, 2, width, width)
		}
		this.select("white")
	}
}

class InventoryManager {
	/**
	 * @type {Array<InventoryPage>}
	 */
	containers = []
	currentPage = 0
	canvas = invCanvas
	iconSize = 64

	/**
	 * @type {InventoryItem}
	 */
	heldItem = null

	// Don't initialize the inventory before the icons have been generated!
	init(creative) {
		// Creative Inventories
		if (creative) {
			let cubes = new InventoryPage(contCtx, blockData[blockIds.grass].iconImg)
			let slabs = new InventoryPage(contCtx, blockData[blockIds.smoothStone | SLAB].iconImg)
			let stairs = new InventoryPage(contCtx, blockData[blockIds.oakPlanks | STAIR].iconImg)
			let decor = new InventoryPage(contCtx, blockData[blockIds.poppy].iconImg)
			for (let id in blockData) {
				const block = blockData[id]
				// eslint-disable-next-line no-prototype-builtins
				if (!block.iconImg) continue

				let item = new InventoryItem(+id, block.name, 1, block.iconImg)

				if (block.shape === shapes.cube && block.solid) {
					cubes.items.push(item)
				}
				else if (block.shape === shapes.slab && block.solid) {
					slabs.items.push(item)
				}
				else if (block.shape === shapes.stair && block.solid) {
					stairs.items.push(item)
				}
				else {
					decor.items.push(item)
				}
			}
			cubes.size = cubes.items.length
			slabs.size = slabs.items.length
			stairs.size = stairs.items.length
			decor.size = decor.items.length
			this.containers.push(cubes, slabs, stairs, decor)
		}
		containerCanvas.onmousemove = e => this.mouseMove(e)
		containerCanvas.onmousedown = e => this.mouseClick(e)
		this.render()

		// Survival/hotbar inventory
		let storage = new InventoryPage(invCtx, blockData[blockIds.bookshelf].iconImg)
		storage.creative = false
		this.playerStorage = storage
		this.hotbar = new Hotbar(storage, 27)
		storage.size = 36
		storage.render(10, 10, this.iconSize)

		containerCanvas.onkeydown = invCanvas.onkeydown = window.parent.canvas.onkeydown
		containerCanvas.onkeyup = invCanvas.onkeyup = window.parent.canvas.onkeyup

		invCanvas.onmousemove = e => {
			storage.mouseMove(e)
		}
		invCanvas.onmousedown = () => {
			this.heldItem = storage.mouseClick(this.heldItem)

			if (this.heldItem) {
				heldItemCanvas.classList.remove("hidden")
				heldCtx.clearRect(0, 0, this.iconSize, this.iconSize)
				this.heldItem.render(heldCtx, 0, 0, this.iconSize)
			}
			else heldItemCanvas.classList.add("hidden")

			for (let i = 0; i < this.hotbar.length; i++) {
				this.hotbar[i] = storage.items[i + 27]?.id || 0
			}
		}
	}

	render() {
		const left = 10
		const top = 10
		const tileSize = this.iconSize

		this.containers[this.currentPage].render(left, top + tileSize + 5, tileSize)

		for (let i = 0; i < this.containers.length; i++) {
			const inv = this.containers[i]
			contCtx.drawImage(inv.icon, left + i * tileSize, top, tileSize, tileSize)
			contCtx.strokeStyle = "red"
			contCtx.strokeRect(left + tileSize * i, top, tileSize, tileSize)
		}
		contCtx.strokeStyle = "green"
		contCtx.strokeRect(left + tileSize * this.currentPage, top, tileSize, tileSize)
	}

	/**
	 * @param {MouseEvent} event
	 */
	mouseMove(event) {
		this.containers[this.currentPage].mouseMove(event)
	}

	mouseClick(event) {
		const mouseX = event.offsetX
		const mouseY = event.offsetY
		if (mouseY < 10 + this.iconSize && mouseY > 10 && mouseX > 10 && mouseX < 10 + this.iconSize * this.containers.length) {
			let newPage = (mouseX - 10) / this.iconSize | 0
			if (newPage !== this.currentPage) {
				this.currentPage = newPage
				this.render()
			}
		}
		else {
			this.heldItem = this.containers[this.currentPage].mouseClick(this.heldItem)
			if (this.heldItem) {
				heldItemCanvas.classList.remove("hidden")
				heldCtx.clearRect(0, 0, this.iconSize, this.iconSize)
				this.heldItem.render(heldCtx, 0, 0, this.iconSize)
			}
			else heldItemCanvas.classList.add("hidden")
		}
	}

	/**
	 * @param {Number} newSize
	 */
	set size(newSize) {
		heldItemCanvas.width = heldItemCanvas.height = this.iconSize = newSize
		if (this.playerStorage) {
			this.playerStorage.render(10, 10, newSize)
			this.render()
		}
	}
}

const inventory = new InventoryManager()
export { InventoryItem, InventoryPage, InventoryManager, inventory }