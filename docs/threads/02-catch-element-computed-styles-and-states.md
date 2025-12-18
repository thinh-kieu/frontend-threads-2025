---
nav: Threads
order: 2
---

# Catch element computed styles and states

When customizing styles for UI libraries such as Ant Design (antd), I often encounter cases where an element receives additional classes on hover (or during other interactions) to apply special effects or visual states. The problem is that as soon as you move your cursor to the DevTools Inspect panel to copy the class name or review the applied styles, the element is no longer in the hover state, and the class disappears.

I struggled with this for quite some time. My workaround used to be very manual: memorizing the class names as quickly as possible or even writing them down before they vanished.

That changed once I discovered the **Break on → Attribute modifications** feature in Chrome DevTools, which allows you to pause execution precisely when an element’s attributes (including classes) change.

![Break on gif](../assets/break-on.gif)

In addition, when debugging whether a piece of text is using the correct font-size, or when investigating UI sizing issues—such as why an element ends up with a specific width or height and where that value is defined—the **Computed** tab becomes an extremely powerful tool. In the Computed styles panel, you can search for the property you care about and click the arrow icon to jump directly to the CSS rule that defines it. In many cases, the value does not come from the element itself but is inherited from or affected by its parent or child elements.

![Computed styles gif](../assets/computed-styles.gif)
