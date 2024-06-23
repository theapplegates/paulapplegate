import eleventyWebcPlugin from "@11ty/eleventy-plugin-webc";
import { eleventyImagePlugin } from "@11ty/eleventy-img";
import dotenv from 'dotenv';
import yaml from 'js-yaml';
import { getAllPosts, onlyMarkdown, tagList } from './src/_config/collections.js';
import events from './src/_config/events.js';
import filters from './src/_config/filters.js';
import plugins from './src/_config/plugins.js';
import shortcodes from './src/_config/shortcodes.js';

dotenv.config();

export default async function (eleventyConfig) {
    eleventyConfig.addWatchTarget('./src/assets/**/*.{css,js,svg,png,jpeg}');
    eleventyConfig.addWatchTarget('./src/_includes/**/*.{webc}');

    // Layout aliases
    eleventyConfig.addLayoutAlias('base', 'base.njk');
    eleventyConfig.addLayoutAlias('home', 'home.njk');
    eleventyConfig.addLayoutAlias('page', 'page.njk');
    eleventyConfig.addLayoutAlias('blog', 'blog.njk');
    eleventyConfig.addLayoutAlias('post', 'post.njk');
    eleventyConfig.addLayoutAlias('tags', 'tags.njk');

    // Collections
    eleventyConfig.addCollection('allPosts', getAllPosts);
    eleventyConfig.addCollection('onlyMarkdown', onlyMarkdown);
    eleventyConfig.addCollection('tagList', tagList);

    // Plugins
    eleventyConfig.addPlugin(plugins.htmlConfig);
    eleventyConfig.addPlugin(plugins.cssConfig);
    eleventyConfig.addPlugin(plugins.jsConfig);
    eleventyConfig.addPlugin(plugins.EleventyRenderPlugin);
    eleventyConfig.addPlugin(plugins.rss);
    eleventyConfig.addPlugin(plugins.syntaxHighlight);

    // Add WebC plugin
    eleventyConfig.addPlugin(eleventyWebcPlugin, {
        components: [
            './src/_includes/webc/*.webc',
            "npm:@11ty/eleventy-img/*.webc",
        ],
        useTransform: true
    });

    // Add Image plugin
    eleventyConfig.addPlugin(eleventyImagePlugin, {
        formats: ["avif", "webp", "jpeg"],
        urlPath: "src/assets/images/",
        defaultAttributes: {
            loading: "lazy",
            decoding: "async",
        },
    });

    // Bundle
    eleventyConfig.addBundle('css', { hoist: true });

    // Library and Data
    eleventyConfig.setLibrary('md', plugins.markdownLib);
    eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

    // Filters
    eleventyConfig.addFilter('toIsoString', filters.toISOString);
    eleventyConfig.addFilter('formatDate', filters.formatDate);
    eleventyConfig.addFilter('markdownFormat', filters.markdownFormat);
    eleventyConfig.addFilter('splitlines', filters.splitlines);
    eleventyConfig.addFilter('striptags', filters.striptags);
    eleventyConfig.addFilter('shuffle', filters.shuffleArray);
    eleventyConfig.addFilter('alphabetic', filters.sortAlphabetically);
    eleventyConfig.addFilter('toAbsoluteUrl', filters.toAbsoluteUrl);
    eleventyConfig.addFilter('slugify', filters.slugifyString);

    // Shortcodes
    eleventyConfig.addShortcode('svg', shortcodes.svgShortcode);
    eleventyConfig.addShortcode('image', shortcodes.imageShortcode);
    eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

    // Events
    if (process.env.ELEVENTY_RUN_MODE === 'serve') {
        eleventyConfig.on('eleventy.after', events.svgToJpeg);
    }

    // Passthrough File Copy
    ['src/assets/fonts/', 'src/assets/images/template', 'src/assets/og-images'].forEach(path =>
        eleventyConfig.addPassthroughCopy(path)
    );
    eleventyConfig.addPassthroughCopy({
        'src/assets/images/favicon/*': '/',
        'node_modules/lite-youtube-embed/src/lite-yt-embed.{css,js}': `assets/components/`
    });

    // Build Settings
    eleventyConfig.setDataDeepMerge(true);

    // General config
    return {
        markdownTemplateEngine: 'njk',
        dir: {
            output: 'dist',
            input: 'src',
            includes: '_includes',
            layouts: '_layouts'
        }
    };
}