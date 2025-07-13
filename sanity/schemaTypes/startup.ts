import { defineField, defineType } from "sanity";

export const startup = defineType({
    name: 'startup',
    title: 'Startup',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string'
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options:{
                source: 'title'
            } 
        }),
        defineField({
            name: 'author',
            type: 'reference',
            to: {type: 'author'}
        }),
        defineField({
            name: 'views',
            type: 'number'
        }),
        defineField({
            name: 'description',
            type: 'text'
        }),
        defineField({
            name: 'category',
            type: 'string',
            validation: (Rule) => Rule.min(1).max(20).required().error("Please enter a category")
        }),
        defineField({
            name: 'image',
            type: 'url',
            validation: (Rule) => Rule.required()
        }),
        defineField({
            name: 'pitch',
            type: 'markdown'
        }),
        defineField({
            name: 'upvotes',
            title: 'Upvotes',
            type: 'array',
            of: [
                { 
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'id',
                            type: 'string'
                        })
                    ]
                    
                }
            ]
        }),
        defineField({
            name: 'downvotes',
            title: 'Downvotes',
            type: 'array',
            of: [
                { 
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'id',
                            type: 'string'
                        })
                    ]
                    
                }
            ]
        }),
        defineField({
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of: [
                { 
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'author',
                            type: 'reference',
                            to: {type: 'author'}
                        }),
                        defineField({
                            name: 'comment',
                            type: 'string'
                        })
                    ]
                }
            ]
        })
    ],
})