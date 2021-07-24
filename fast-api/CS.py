import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import re
import string
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
from nltk.stem import WordNetLemmatizer
import nltk
# -*- coding: utf-8 -*-

class CS(object):
    def __init__(self, df_data):
        self.df = df_data[['SID', 'NAME', 'CATEGORY', 'company', 'des']]

    def lem_word(self, text):
        # Init the Wordnet Lemmatizer
        lem = WordNetLemmatizer()
        tokens = [lem.lemmatize(word, pos='a') for word in text]
        tokens = [lem.lemmatize(word, pos='v') for word in tokens]
        tokens = [lem.lemmatize(word, pos='n') for word in tokens]

        return tokens
    
    def clean_text(self, text):
        # lower text
        text = text.lower()
        # remove text in square brackets
        text = re.sub('\[.*?\]', ' ', text)
        # remove punctuation
        text = re.sub('[%s]' % re.escape(string.punctuation), ' ', text)
        # remove special characters
        #text = re.sub('[^a-zA-Z]', ' ', text)
        # remove empty line
        text = re.sub('\n', ' ', text)
        # # remove words containing numbers.
        text = re.sub('\w*\d\w*', ' ', text)
        # remove extra whitespaces
        text = re.sub(' +', ' ', text)
        # # remove single character
        text = ' '.join([word for word in text.split() if len(word) > 1])
        return text.strip()

    def remove_sw(self, text):
        filtered_words = [word for word in text if word not in ENGLISH_STOP_WORDS]
        return filtered_words

    def convert(self):
        # instantiating and generating the count matrix
        count = CountVectorizer()
        count_matrix = count.fit_transform(self.df['final'])
        return count_matrix

    def pre_process(self):
        self.df['clean_des'] = self.df['des'].apply(self.clean_text)
        self.df['split_des'] = self.df['clean_des'].apply(lambda x: x.split())
        self.df['lemmatize_text'] = self.df['split_des'].apply(self.lem_word)
        self.df['text_remove_stopwords'] = self.df['lemmatize_text'].apply(lambda row: self.remove_sw(row))
        self.df['combine'] = self.df['text_remove_stopwords'].apply(lambda x: ' '.join(x))

        self.df['final'] = self.df['CATEGORY'] + ' ' + self.df['company'].apply(lambda x: str(x)) + ' ' + self.df[
            'combine']
        print(self.df['final'])
        # creating a Series for the movie titles so they are associated to an ordered numerical
        # list I will use later to match the indexes
        self.df.set_index('SID', inplace=True)
        self.indices = pd.Series(self.df.index)

    def calculate(self):
        self.count_matrix = self.convert()
        self.cos_sim = cosine_similarity(self.count_matrix, self.count_matrix)
        return self.cos_sim

    def fit(self):
        nltk.download('wordnet')
        self.pre_process()
        self.calculate()

    # function that takes in movie title as input and returns the top 10 recommended movies
    def recommendations(self, SID, top=10):
        cosine_sim = self.cos_sim
        recommended_items = []

        # getting the index of the movie that matches the title
        idx = self.indices[self.indices == SID].index[0]

        # creating a Series with the similarity scores in descending order
        score_series = pd.Series(cosine_sim[idx]).sort_values(ascending=False)

        # getting the indexes of the 10 most similar movies
        top_k_indexes = list(score_series.iloc[1:(1 + top)].index)

        # populating the list with the titles of the best 10 matching movies
        for i in top_k_indexes:
            recommended_items.append(list(self.df.index)[i])
            #recommended_SID.append(list(self.df['NAME'])[i])

        return recommended_items

""" 
    How to use algorithm
    data = pd.read_json("all.json")
    rs = CS(data)
    rs.fit()
    res = rs.recommendations(2, 10)
    print(res)
"""

