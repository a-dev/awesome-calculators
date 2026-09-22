# Contribution guidelines

Thank you for helping people find useful calculators.

## Suggesting an application

Please search all lists and existing pull requests for duplicates before submitting an application.

In your pull request, explain the idea behind the project and how it aims to help users. Tell us when it first became publicly available, and disclose any affiliation with it. An approximate date is fine. If you don't know, say so. Reviews or examples of use are welcome if you have them.

## What belongs here

We include applications that:

- Accept input and calculate results as a main function.
- Work, have documentation, and offer an English interface.
- Have a reason to recommend them, such as a useful purpose, a distinctive capability, an authoritative source, popularity, or a strong open-source implementation.
- Have official pages that confirm their platforms, pricing, license, and source availability.
- Are tools people can use directly on the web, desktop, or mobile, or through a browser extension, built-in feature, launcher, or command line.

Please leave out:

- Libraries, APIs, SDKs, code snippets, spreadsheets, templates, articles, tutorials, videos, or communities.
- Pages built mainly to attract search traffic with little useful functionality, link collections without their own calculators, or applications dominated by intrusive advertising.
- Projects that no longer work, are deprecated or archived, or have no documentation.
- Individual calculators from an already listed collection, unless they are unusually authoritative or capable on their own.

For mature applications that are no longer maintained but still work, please suggest [`unmaintained.md`](unmaintained.md).

## Choosing a list

Maintainers decide which list fits each application based on the available evidence.

- The main [README](README.md) requires a credible independent review or use case that supports the recommendation. A thorough maintainer assessment also qualifies if it covers representative calculations, edge cases, and documented methods or assumptions.
- [Emerging Calculators](emerging.md) is for useful applications that pass basic checks but need more evidence before we can recommend them on the main list. Placement here does not imply poor quality.

There is no minimum age or automatic promotion. Launch dates can be uncertain, and age alone does not show reliability. Claims from the creator, directory listings, popularity counts, and a working homepage also do not establish calculation quality on their own.

## How maintainers review applications

Before adding an application to the main or Emerging list, maintainers:

- Use the application beyond its landing page.
- Try a few representative inputs and compare the results with independently calculated answers. Record the inputs, expected answers, and actual results in the pull request.
- Check that the application is useful and explains its methods or assumptions well enough to interpret the results.
- Verify platforms, price, license, and source availability against official pages.

Both lists follow the eligibility rules above. Applications stay in pull request discussion until they pass these checks; Emerging is not a default destination for unreviewed submissions.

Keep review notes in the pull request discussion or closing comment. Keep the placement criteria in the Emerging introduction. The same criteria apply to existing entries, and moving an application to the main list requires a review with supporting evidence.

## Entry format

Please add one application per pull request, in alphabetical order within the category that fits it best. Follow the existing format:

```markdown
- [Application](https://example.com/) - Objective reason it is useful. `Web` `macOS` · **Price:** US$10 one-time · **License:** Proprietary.
```

For open-source software:

```markdown
- [Application](https://example.com/) - Objective reason it is useful. `Web` `Linux` · **Price:** Free · **License:** MIT · **Source:** [GitHub](https://github.com/example/app).
```

### Price

Use the exact current price and the product's own currency. Use `from` when several exact plans are available. Pricing labels include `Free`, `Freemium`, `Free trial`, `one-time`, `month`, and `year`.

Check each paid price on an official pricing page and include the URL in your pull request. Wait to add the application until you can confirm its exact current price.

### License and source

Check the license file before describing a project as open source. A public repository alone does not make it open source.

- For open-source software, use its SPDX license identifier.
- For proprietary software, use `Proprietary`.
- If a public repository has no license, use `No license specified`.

The optional **Source** link can point to publicly available code even if it is not open source.

### Platforms and region

Available platform labels include `Web`, `macOS`, `Windows`, `Linux`, `iOS`, `iPadOS`, `Android`, `Browser extension`, and `CLI`. Add a region label such as `US` or `UK` when formulas depend on local rules.

### Description and links

Write a brief, factual description that starts with a capital letter and ends with a period. Avoid promotional words such as "best," "beautiful," or "revolutionary."

In each entry, link only the application name and optional **Source** field. Keep prices, platform names, licenses, and descriptions as plain text. Put pricing and license evidence links in the pull request. This rule applies to all three lists and does not restrict navigation links between files or sections.

## Keeping the lists organized

List each application only once across all lists. Emerging uses the README's categories, category order, alphabetical order, and entry format. Keep all category headings, even when they are empty.

At the end of each README category with Emerging entries, add one relative link to the matching section in `emerging.md`. Remove that link if the Emerging category becomes empty.

## Before submitting

Complete the pull request template and keep unrelated changes in separate pull requests. Run the repository checks:

```sh
npm install
npm test
```

By participating, you agree to follow the [Code of Conduct](code-of-conduct.md).
