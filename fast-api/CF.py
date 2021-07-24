import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse
import operator
from pandas import DataFrame

class CF (object) :
    """Function of recommendation system"""
    def __init__(self, Y_data, k, dist_func=cosine_similarity):
        # we need to take Y_data[:, [1, 0, 2]] because we use item_based
        self.Y_data = Y_data[:, [1, 0, 2]]
        #self.k = k # number of neighbor points
        self.dist_func = dist_func
        self.k = k
        self.Ybar_data = None
        self.items_related = []
        self.recommended_users = []
        # Number of user and items. Remember to add 1 since id starts from 0
        self.number_items = int(np.max(self.Y_data[:, 0])) + 1
        self.number_users = int(np.max(self.Y_data[:, 1])) + 1
        self.recommend_list = []

    def normalize_Y(self):
        users = self.Y_data[:, 0] # all users - first col of the Y_data
        self.Ybar_data = self.Y_data.copy()
        #print(self.Ybar_data)
        self.mu = np.zeros((self.number_items,))

        for n in range(self.number_items):
            # row indices of rating done by user n
            # since indices need to be integers, we need to convert
            ids = np.where(users == n)[0].astype(np.int32)
            # indices of all ratings associated with user n
            item_ids = self.Y_data[ids, 1]
            # and the corresponding ratings
            ratings = self.Y_data[ids, 2]
            # take mean
            m = np.mean(ratings)
            if np.isnan(m):
                m = 0 # to avoid empty arrat and nan value
            # normalize
            self.mu[n] = m
            """
            Here we need a function to update average rating for each items in database
            """
            self.Ybar_data[ids, 2] = ratings - self.mu[n]

            ###########################################
            # from the rating matrix as a sparse matrix. Sparsity is important
            # for both memory and computing efficiency. For example, if # user = 1M,
            # #item = 100k, then shape of the rating matrix would be (100k, 1M),
            # you may not have enough memory to store this. Then, instead, we store
            # nonzeros only, and, of course, their locatinos.
            self.Ybar = sparse.coo_matrix((self.Ybar_data[:, 2],
                                           (self.Ybar_data[:, 1], self.Ybar_data[:, 0])), (self.number_users, self.number_items))
            self.Ybar = self.Ybar.tocsr()

    def similarity(self):
        self.S = self.dist_func(self.Ybar.T, self.Ybar.T)
        #print(self.Ybar[0])

    def refresh(self):
        """
        Normalize data and calculate similarity matrix again (after some few ratings added)
        Excute all function
        """
        self.normalize_Y()
        self.similarity()
        self.recommendation()

    def fit(self):
        self.refresh()


    def __pred(self, i, u, normalized=1):
        """
        predict the rating of item i for user u(normalized)
        if you need the un
        """
        # Step 1: find all items which rated u
        ids = np.where(self.Y_data[:, 1] == u)[0].astype(np.int32)
        # Step 2:
        items_rated_u = (self.Y_data[ids, 0]).astype(np.int32)
        # Step 3: find similarity btw the current items and others
        # which already rated u
        sim = self.S[i, items_rated_u]
        # Step 4: find the k most similarity items
        a = np.argsort(sim)[-self.k:]
        # and the corresponding similarity levels
        nearest_s = sim[a]
        # How did each of 'near' items rated user u
        r = self.Ybar[u, items_rated_u[a]]
        if normalized:
            # add a small number, for instance, 1e-8, to avoid dividing by 0
            return (r * nearest_s)[0] / (np.abs(nearest_s).sum() + 1e-8)

        return (r * nearest_s)[0] / (np.abs(nearest_s).sum() + 1e-8) + self.mu[i]

    def recommend(self, i, normalized=1):
        """
        Determine all item should be recommend for users u
        or all users who might have interest on item u
        The dicesion is made based on all i such that
        self.pred(u, i) > 0. Suppose we are considering items which have not been rated by u yet
        """
        ids = np.where(self.Y_data[:, 0] == i)[0]
        users_rated_by_i = self.Y_data[ids, 1].tolist()
        for u in range(self.number_users):
            if u not in users_rated_by_i:
                rating = self.__pred(i, u)
                if rating > 0:
                    self.recommend_list.append([u, i, rating])

    # Create list of recommended users for each items
    def recommendation(self):
        for i in range(self.number_items):
            self.recommend(i)

    def predict(self, user_id):
        items_with_predict = []
        for i in range(len(self.recommend_list)):
            if(self.recommend_list[i][0] == user_id):
                items_with_predict.append([self.recommend_list[i][1], self.recommend_list[i][2]])
        items_with_predict.sort(key=operator.itemgetter(1), reverse=True)

        items = []
        for i in range(len(items_with_predict)):
            items.append(items_with_predict[i][0])
        
        return items
