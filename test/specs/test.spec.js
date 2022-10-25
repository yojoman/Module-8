const mainPage = require("../pages/main.page");
const productPage = require("../pages/product.page");
const searchPage = require("../pages/search.page");
const resources = require("../resources/data.js");
const { expect, assert } = require("chai");

describe("Onliner.by", () => {
  before(async () => {
    await browser.maximizeWindow();
  });

  it("Should open main page", async () => {
    await mainPage.openPage();
    expect(await mainPage.getTitle()).to.equal("Onliner");
  });

  it("Main page should contain correct header info", async () => {
    const headerActualValue = await mainPage.getHeaderMenuText();
    assert.sameMembers(
      resources.headerExpectedValue,
      headerActualValue,
      "Main page contain incorrect header values"
    );
  });

  it("Main page should contain correct footer info", async () => {
    const footerActualValue = await mainPage.getFooterMenuText();
    assert.sameMembers(
      resources.footerExpectedValue,
      footerActualValue,
      "Main page contain incorrect footer values"
    );
  });

  it("Should open searched item page", async () => {
    await searchPage.typeInSearhField(
      "iPhone 14 Pro Max 256GB (космический черный)"
    );
    await searchPage.openItemFromSearchField(1);
    expect(await searchPage.getTitle()).to.include(
      "iPhone 14 Pro Max 256GB (космический черный)"
    );
  });

  it("Product page should containt title, image and price", async () => {
    expect(
      await productPage
        .getProductTitleText("iPhone 14 Pro Max 256GB (космический черный)")
        .isDisplayed()
    ).to.equal(true);
    expect(await productPage.priceOfProduct.isDisplayed()).to.equal(true);
    expect(await productPage.productImage.isDisplayed()).to.equal(true);
  });

  it("Should open Discuss on forum page", async () => {
    await productPage.clickOnButton("Обсуждение на форуме");
    await productPage.waitForElementDisplayed(productPage.forumMessagesFrame);
    expect(await productPage.forumMessagesFrame.isDisplayed()).to.equal(true);
    await productPage.back();
  });

  it("Should should open Offers page by using actionsPerform", async () => {
    const getOffersButton = await $(".//span[text()='Предложения продавцов']");
    browser.performActions([
      {
        type: "pointer",
        id: 'finger1',
        parameters: { pointerType: "mouse" },
        actions: [
          {
            type: "pointerMove",
            origin: "pointer",
            origin: await getOffersButton,
            x: 0,
            y: 0,
          },
          { type: "pointerDown", button: 0 },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    await productPage.waitForElementDisplayed(productPage.getProductTitleText("iPhone 14 Pro Max 256GB (космический черный)"));
    expect(await productPage.getProductTitleText("iPhone 14 Pro Max 256GB (космический черный)").isDisplayed()).to.equal(true);
  });

  it("Should open Adverts page by using JSexecutor", async () => {
    await browser.execute(function () {
      document
        .querySelectorAll(".offers-list__button_cart")[1]
        .scrollIntoView();
    });
    await browser.execute(function () {
      document.querySelectorAll(".offers-list__button_cart")[1].click();
    });
    await productPage.waitForElementDisplayed(
      productPage.getCartTitleText("Товар добавлен в корзину")
    );
    expect(
      await productPage
        .getCartTitleText("Товар добавлен в корзину")
        .isDisplayed()
    ).to.equal(true);
  });
});
