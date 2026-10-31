# heapify1.0
URL-"https://heapify10-8ebmpkjbda4w5ae4uknkqw.streamlit.app/"
# 🔷 HEAPIFY 1.0 – Interactive Heap Sort Visualizer

**Understand Heap Sort. Visualize Every Step. Learn Through Interaction.**

HEAPIFY 1.0 is an interactive web-based visualization tool designed to make the Heap Sort algorithm easier to understand. It visually demonstrates how a Max Heap is created and how elements are repeatedly extracted and arranged in sorted order.

Instead of simply displaying the final sorted array, HEAPIFY helps learners understand the algorithm's working through step-by-step visualization.

## 🚀 Live Demo

[View HEAPIFY 1.0](https://heapify1-0.vercel.app/)

## ✨ Features

- **Interactive Heap Visualization:** Understand the structure of a Binary Max Heap.
- **Array Visualization:** Observe how array elements change during sorting.
- **Generate Heap:** Create a heap from your input array.
- **Random Array Generator:** Generate random numbers to experiment with.
- **Step-by-Step Execution:** Move through the sorting process using Previous and Next controls.
- **Play/Pause Controls:** Control the visualization at your own pace.
- **Speed Control:** Adjust the animation speed.
- **Reset Functionality:** Restart the visualization whenever needed.
- **Real-Time Learning:** Understand comparisons, swaps, heap construction, and extraction.

## 🧠 Algorithm Used

HEAPIFY implements **Heap Sort**, a comparison-based sorting algorithm that uses a Binary Heap data structure.

### How Heap Sort Works

1. **Build Max Heap:** Convert the given array into a Max Heap.
2. **Extract Maximum:** Move the root (largest element) to the end of the array.
3. **Heapify:** Restore the Max Heap property for the remaining elements.
4. **Repeat:** Continue until all elements are sorted.

## 📊 Time and Space Complexity

| Case | Time Complexity |
|---|---|
| Best Case | O(n log n) |
| Average Case | O(n log n) |
| Worst Case | O(n log n) |

- **Auxiliary Space:** O(1) for the in-place Heap Sort algorithm.
- **Sorting Technique:** Comparison-based sorting.
- **Data Structure:** Binary Max Heap.

## 🛠️ Technologies Used

- **HTML5** – Structure of the application.
- **CSS3** – Styling, layout, and animations.
- **JavaScript (Vanilla JS)** – Heap Sort logic and interactive functionality.

## 📁 Project Structure

```text
heapify1.0/
│
├── index.html      # Main webpage
├── STYLE.css       # Styling and layout
├── script.js       # Heap Sort logic and visualization
└── README.md       # Project documentation
```

## 💻 Run Locally

Follow these steps to run HEAPIFY on your computer:

1. Clone the repository:

```bash
git clone https://github.com/tiyamaheshwari01-ux/heapify1.0.git
```

2. Open the project folder:

```bash
cd heapify1.0
```

3. Open `index.html` in your browser, or use the VS Code Live Server extension.

## 🎯 Project Objective

The main objective of HEAPIFY is to simplify the learning of sorting algorithms through visual representation and interactive controls. It helps students understand the relationship between arrays, binary heaps, and sorting operations.

## 🔮 Future Enhancements

- Add additional sorting algorithms.
- Introduce more visualization modes.
- Display detailed explanations for every sorting operation.
- Add performance comparisons between sorting algorithms.

## 👩‍💻 Developed By

**Tanishka Maheshwari**

B.Tech – Computer Science and Engineering

**Project:** HEAPIFY 1.0 – Interactive Heap Sort Visualizer

---

⭐ If you find this project useful, consider giving the repository a star!
